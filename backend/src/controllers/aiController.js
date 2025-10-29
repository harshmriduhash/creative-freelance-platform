const axios = require("axios");
const User = require("../models/User");

// AI Service Configuration
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Helper: Check AI usage limits
const checkAIUsage = async (userId) => {
  const user = await User.findById(userId);
  user.resetAIUsageIfNeeded();

  const limit =
    user.subscription.tier === "premium" ? Infinity : user.aiUsage.monthlyLimit;

  if (user.aiUsage.monthlyUsed >= limit) {
    throw new Error(
      "Monthly AI usage limit reached. Please upgrade to premium."
    );
  }

  return user;
};

// Helper: Increment AI usage
const incrementAIUsage = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { "aiUsage.monthlyUsed": 1 },
  });
};

// Helper: Call Claude API
const callClaudeAPI = async (prompt, systemPrompt = "") => {
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error("Claude API Error:", error.response?.data || error.message);
    throw new Error("AI service temporarily unavailable");
  }
};

// Helper: Call OpenAI API
const callOpenAI = async (prompt, systemPrompt = "") => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("AI service temporarily unavailable");
  }
};

// @desc    Generate gig ideas based on user input
// @route   POST /api/ai/generate-gig-ideas
// @access  Private
exports.generateGigIdeas = async (req, res) => {
  try {
    const user = await checkAIUsage(req.user.id);
    const { topic, category, count = 3 } = req.body;

    const systemPrompt =
      "You are a creative consultant helping freelancers create compelling gig listings.";
    const prompt = `Generate ${count} unique gig ideas for a ${category} professional interested in ${topic}. For each idea, provide:
1. A catchy title (max 80 characters)
2. A brief description (2-3 sentences)
3. Suggested skills needed
4. Estimated budget range

Format as JSON array.`;

    const response = await callClaudeAPI(prompt, systemPrompt);
    await incrementAIUsage(req.user.id);

    res.json({
      success: true,
      ideas: response,
      remainingUsage: user.aiUsage.monthlyLimit - user.aiUsage.monthlyUsed - 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Generate proposal for a gig
// @route   POST /api/ai/generate-proposal
// @access  Private
exports.generateProposal = async (req, res) => {
  try {
    const user = await checkAIUsage(req.user.id);
    const { gigTitle, gigDescription, userSkills, deliveryTime } = req.body;

    const systemPrompt =
      "You are an expert proposal writer helping freelancers win projects.";
    const prompt = `Write a compelling proposal (max 400 words) for this gig:

Title: ${gigTitle}
Description: ${gigDescription}

My skills: ${userSkills.join(", ")}
I can deliver in: ${deliveryTime} days

Make it professional, personalized, and highlight relevant experience.`;

    const response = await callClaudeAPI(prompt, systemPrompt);
    await incrementAIUsage(req.user.id);

    res.json({
      success: true,
      proposal: response,
      aiAssisted: true,
      remainingUsage: user.aiUsage.monthlyLimit - user.aiUsage.monthlyUsed - 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Generate creative content (text, ideas, etc.)
// @route   POST /api/ai/generate-content
// @access  Private
exports.generateContent = async (req, res) => {
  try {
    const user = await checkAIUsage(req.user.id);
    const { type, prompt, context } = req.body;

    let systemPrompt = "";
    let fullPrompt = prompt;

    switch (type) {
      case "tagline":
        systemPrompt =
          "You are a creative copywriter specializing in taglines.";
        break;
      case "description":
        systemPrompt =
          "You are a marketing expert writing product descriptions.";
        break;
      case "brainstorm":
        systemPrompt = "You are a creative brainstorming partner.";
        break;
      default:
        systemPrompt = "You are a helpful creative assistant.";
    }

    if (context) {
      fullPrompt = `Context: ${context}\n\nTask: ${prompt}`;
    }

    const response = await callClaudeAPI(fullPrompt, systemPrompt);
    await incrementAIUsage(req.user.id);

    res.json({
      success: true,
      content: response,
      type,
      remainingUsage: user.aiUsage.monthlyLimit - user.aiUsage.monthlyUsed - 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Analyze project requirements
// @route   POST /api/ai/analyze-requirements
// @access  Private
exports.analyzeRequirements = async (req, res) => {
  try {
    const user = await checkAIUsage(req.user.id);
    const { description } = req.body;

    const systemPrompt =
      "You are a project analyst helping break down complex requirements.";
    const prompt = `Analyze this project description and extract:
1. Key deliverables
2. Required skills
3. Potential challenges
4. Estimated time range
5. Suggested milestones

Project: ${description}

Format as structured JSON.`;

    const response = await callClaudeAPI(prompt, systemPrompt);
    await incrementAIUsage(req.user.id);

    res.json({
      success: true,
      analysis: response,
      remainingUsage: user.aiUsage.monthlyLimit - user.aiUsage.monthlyUsed - 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get AI usage statistics
// @route   GET /api/ai/usage
// @access  Private
exports.getUsageStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resetAIUsageIfNeeded();

    res.json({
      success: true,
      usage: {
        used: user.aiUsage.monthlyUsed,
        limit:
          user.subscription.tier === "premium"
            ? "unlimited"
            : user.aiUsage.monthlyLimit,
        remaining:
          user.subscription.tier === "premium"
            ? "unlimited"
            : user.aiUsage.monthlyLimit - user.aiUsage.monthlyUsed,
        resetDate: user.aiUsage.lastResetDate,
        tier: user.subscription.tier,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
