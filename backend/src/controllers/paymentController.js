const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Project = require('../models/Project');
const User = require('../models/User');

const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE) || 0.15;

// @desc    Create payment intent for project
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { projectId, amount } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only client can create payment
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        projectId: projectId,
        clientId: req.user.id,
        freelancerId: project.freelancer.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Confirm payment and release to freelancer
// @route   POST /api/payments/confirm-payment
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { projectId, paymentIntentId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const totalAmount = paymentIntent.amount / 100;
      const platformFee = totalAmount * COMMISSION_RATE;
      const freelancerEarnings = totalAmount - platformFee;

      // Update project payment info
      project.payment.paidAmount = totalAmount;
      project.payment.platformFee = platformFee;
      project.payment.freelancerEarnings = freelancerEarnings;
      project.payment.stripePaymentIntentId = paymentIntentId;
      await project.save();

      // Update freelancer balance
      await User.findByIdAndUpdate(project.freelancer, {
        $inc: { balance: freelancerEarnings }
      });

      res.json({ success: true, project });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create subscription for premium features
// @route   POST /api/payments/subscribe
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { priceId } = req.body; // Stripe price ID

    const user = await User.findById(req.user.id);

    // Create or retrieve Stripe customer
    let customerId = user.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Update user subscription
    user.subscription.tier = 'premium';
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.aiUsage.monthlyLimit = Infinity;
    await user.save();

    res.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/payments/cancel-subscription
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    user.subscription.cancelAtPeriodEnd = true;
    await user.save();

    res.json({ success: true, message: 'Subscription will cancel at period end' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/payments/webhook
// @access  Public (Stripe only)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { 'subscription.stripeSubscriptionId': subscription.id },
          {
            'subscription.tier': 'free',
            'subscription.stripeSubscriptionId': null,
            'aiUsage.monthlyLimit': 10
          }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
