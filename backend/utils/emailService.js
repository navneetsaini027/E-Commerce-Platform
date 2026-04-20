const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getWelcomeTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Aashirwad Fashion</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Top red line -->
        <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>

        <!-- Header -->
        <tr>
          <td style="background:#111;padding:48px 40px 36px;text-align:center;border-left:1px solid #222;border-right:1px solid #222;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:6px;color:#E50010;text-transform:uppercase;font-family:Arial,sans-serif;">Est. 2018 &nbsp;·&nbsp; India</p>
            <h1 style="margin:0;font-size:38px;font-weight:900;color:#fff;letter-spacing:3px;font-family:'Georgia',serif;">Aashirwad</h1>
            <h2 style="margin:4px 0 0;font-size:16px;font-weight:400;color:#aaa;letter-spacing:8px;text-transform:uppercase;font-family:Arial,sans-serif;">Fashion</h2>
            <div style="width:60px;height:1px;background:#E50010;margin:20px auto 0;"></div>
          </td>
        </tr>

        <!-- Hero image strip -->
        <tr>
          <td style="padding:0;border-left:1px solid #222;border-right:1px solid #222;">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" width="600" alt="Fashion" style="display:block;width:100%;height:220px;object-fit:cover;object-position:center 30%;"/>
          </td>
        </tr>

        <!-- Welcome message -->
        <tr>
          <td style="background:#111;padding:48px 40px;text-align:center;border-left:1px solid #222;border-right:1px solid #222;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:4px;color:#E50010;text-transform:uppercase;font-family:Arial,sans-serif;">A warm welcome</p>
            <h2 style="margin:0 0 16px;font-size:32px;color:#fff;font-weight:700;font-family:'Georgia',serif;">Dear ${name},</h2>
            <p style="margin:0 0 24px;font-size:16px;color:#ccc;line-height:1.8;font-family:Arial,sans-serif;">
              We are delighted to welcome you to <strong style="color:#fff;">Aashirwad Fashion</strong> — where every thread tells a story of elegance, culture, and modern style.
            </p>
            <p style="margin:0;font-size:15px;color:#999;line-height:1.8;font-family:Arial,sans-serif;">
              Your journey into premium Indian fashion begins today. Explore our curated collections crafted for the modern wardrobe — from luxurious ethnic wear to contemporary street style.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="background:#111;padding:0 40px;border-left:1px solid #222;border-right:1px solid #222;">
          <div style="height:1px;background:linear-gradient(to right,transparent,#333,transparent);"></div>
        </td></tr>

        <!-- Coupon box -->
        <tr>
          <td style="background:#111;padding:40px;text-align:center;border-left:1px solid #222;border-right:1px solid #222;">
            <p style="margin:0 0 20px;font-size:12px;letter-spacing:4px;color:#E50010;text-transform:uppercase;font-family:Arial,sans-serif;">Exclusive Welcome Gift</p>
            <div style="border:1px dashed #E50010;padding:28px 32px;display:inline-block;background:#1a0a0a;border-radius:4px;">
              <p style="margin:0 0 8px;font-size:12px;color:#999;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Your first order discount</p>
              <p style="margin:0 0 12px;font-size:42px;font-weight:900;color:#E50010;letter-spacing:6px;font-family:'Georgia',serif;">15% OFF</p>
              <div style="background:#0a0a0a;border:1px solid #333;padding:10px 24px;display:inline-block;border-radius:2px;">
                <p style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:8px;font-family:'Courier New',monospace;">WELCOME15</p>
              </div>
              <p style="margin:12px 0 0;font-size:11px;color:#666;font-family:Arial,sans-serif;">Valid on your first purchase · No minimum order</p>
            </div>
          </td>
        </tr>

        <!-- Features -->
        <tr>
          <td style="background:#0f0f0f;padding:40px;border-left:1px solid #222;border-right:1px solid #222;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="text-align:center;padding:0 12px;">
                  <p style="margin:0 0 8px;font-size:24px;">✦</p>
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fff;letter-spacing:1px;font-family:Arial,sans-serif;">Premium Quality</p>
                  <p style="margin:0;font-size:12px;color:#666;font-family:Arial,sans-serif;">Handpicked fabrics & craftsmanship</p>
                </td>
                <td width="33%" style="text-align:center;padding:0 12px;border-left:1px solid #222;border-right:1px solid #222;">
                  <p style="margin:0 0 8px;font-size:24px;">✦</p>
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fff;letter-spacing:1px;font-family:Arial,sans-serif;">Free Shipping</p>
                  <p style="margin:0;font-size:12px;color:#666;font-family:Arial,sans-serif;">On all orders above ₹599</p>
                </td>
                <td width="33%" style="text-align:center;padding:0 12px;">
                  <p style="margin:0 0 8px;font-size:24px;">✦</p>
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fff;letter-spacing:1px;font-family:Arial,sans-serif;">Easy Returns</p>
                  <p style="margin:0;font-size:12px;color:#666;font-family:Arial,sans-serif;">15-day hassle-free returns</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td style="background:#111;padding:40px;text-align:center;border-left:1px solid #222;border-right:1px solid #222;">
            <a href="https://e-commerce-platform-five-black.vercel.app" style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:16px 48px;font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">
              Shop Now
            </a>
            <p style="margin:20px 0 0;font-size:13px;color:#555;font-family:Arial,sans-serif;">
              Explore 500+ styles across 6 categories
            </p>
          </td>
        </tr>

        <!-- Bottom red line -->
        <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a0a0a;padding:28px 40px;text-align:center;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;">
            <p style="margin:0 0 8px;font-size:13px;color:#555;font-family:Arial,sans-serif;">
              © 2026 Aashirwad Fashion · New Delhi, India
            </p>
            <p style="margin:0;font-size:11px;color:#333;font-family:Arial,sans-serif;">
              Designed by Navneet Kumar Saini
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
`;

const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Aashirwad Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Aashirwad Fashion, ${name}! 🎉 Here's your 15% off`,
      html: getWelcomeTemplate(name),
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

const sendOrderConfirmationEmail = async (email, name, order) => {
  try {
    const itemsList = order.items?.map(item => 
      `<tr>
        <td style="padding:10px;border-bottom:1px solid #222;color:#ccc;font-family:Arial,sans-serif;font-size:13px;">${item.product?.name || item.name || 'Product'}</td>
        <td style="padding:10px;border-bottom:1px solid #222;color:#ccc;font-family:Arial,sans-serif;font-size:13px;text-align:center;">${item.qty}</td>
        <td style="padding:10px;border-bottom:1px solid #222;color:#fff;font-family:Arial,sans-serif;font-size:13px;text-align:right;">₹${((item.price || 0) * item.qty).toLocaleString()}</td>
      </tr>`
    ).join('') || '';

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
            <tr>
              <td style="background:#111;padding:40px;text-align:center;border-left:1px solid #222;border-right:1px solid #222;">
                <h1 style="margin:0;font-size:32px;color:#fff;letter-spacing:3px;">Aashirwad Fashion</h1>
                <p style="margin:8px 0 0;font-size:12px;color:#E50010;letter-spacing:4px;text-transform:uppercase;">Order Confirmed</p>
              </td>
            </tr>
            <tr>
              <td style="background:#111;padding:32px 40px;border-left:1px solid #222;border-right:1px solid #222;">
                <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Thank you, ${name}! 🎉</h2>
                <p style="color:#999;font-size:14px;margin:0 0 24px;">Your order has been placed successfully.</p>
                <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;margin-bottom:24px;">
                  <p style="color:#E50010;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Order ID</p>
                  <p style="color:#fff;font-size:16px;font-family:'Courier New',monospace;margin:0;">#${order._id?.toString().slice(-8).toUpperCase() || 'XXXXXXXX'}</p>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #333;border-radius:8px;overflow:hidden;">
                  <thead>
                    <tr style="background:#1a1a1a;">
                      <th style="padding:10px;text-align:left;color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Item</th>
                      <th style="padding:10px;text-align:center;color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Qty</th>
                      <th style="padding:10px;text-align:right;color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsList}</tbody>
                  <tfoot>
                    <tr style="background:#1a1a1a;">
                      <td colspan="2" style="padding:14px;color:#fff;font-weight:700;font-size:14px;">Total</td>
                      <td style="padding:14px;color:#E50010;font-weight:700;font-size:16px;text-align:right;">₹${(order.totalAmount || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
                <div style="margin-top:24px;padding:16px;background:#1a0a0a;border:1px solid #E50010;border-radius:8px;">
                  <p style="color:#E50010;font-size:12px;margin:0 0 4px;font-weight:700;">📦 Delivery Address</p>
                  <p style="color:#ccc;font-size:13px;margin:0;">${order.shippingAddress?.name || name}, ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}</p>
                </div>
              </td>
            </tr>
            <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
            <tr>
              <td style="background:#0a0a0a;padding:20px 40px;text-align:center;border:1px solid #1a1a1a;">
                <p style="color:#555;font-size:11px;margin:0;">© 2026 Aashirwad Fashion · Designed by Navneet Kumar Saini</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    await transporter.sendMail({
      from: `"Aashirwad Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmed! #${order._id?.toString().slice(-8).toUpperCase()} - Aashirwad Fashion`,
      html,
    });
    console.log(`✅ Order confirmation email sent to ${email}`);
  } catch (err) {
    console.error('❌ Order email failed:', err.message);
  }
};

// Order Status Update Email
const sendOrderStatusEmail = async (email, name, orderId, status) => {
  const statusMessages = {
    processing: { emoji: '⚙️', title: 'Order Being Processed', msg: 'Your order is being prepared with care.' },
    shipped: { emoji: '🚚', title: 'Order Shipped!', msg: 'Your order is on its way! Track it with your delivery partner.' },
    delivered: { emoji: '✅', title: 'Order Delivered!', msg: 'Your order has been delivered. We hope you love it!' },
    cancelled: { emoji: '❌', title: 'Order Cancelled', msg: 'Your order has been cancelled. Refund will be processed in 5-7 days.' },
  };
  const s = statusMessages[status] || { emoji: '📦', title: 'Order Update', msg: `Your order status: ${status}` };
  try {
    await transporter.sendMail({
      from: `"Aashirwad Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${s.emoji} ${s.title} - Order #${orderId?.toString().slice(-8).toUpperCase()}`,
      html: `
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#111;padding:40px;text-align:center;border:1px solid #222;">
                <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">Aashirwad Fashion</h1>
                <p style="font-size:40px;margin:20px 0;">${s.emoji}</p>
                <h2 style="color:#E50010;font-size:22px;margin:0 0 16px;">${s.title}</h2>
                <p style="color:#ccc;font-size:15px;margin:0 0 24px;">Dear ${name}, ${s.msg}</p>
                <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin-bottom:24px;">
                  <p style="color:#999;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Order ID</p>
                  <p style="color:#fff;font-size:16px;font-family:'Courier New',monospace;margin:0;">#${orderId?.toString().slice(-8).toUpperCase()}</p>
                </div>
                <a href="https://e-commerce-platform-five-black.vercel.app" style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:14px 40px;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">View Order</a>
              </td></tr>
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#0a0a0a;padding:20px;text-align:center;border:1px solid #1a1a1a;">
                <p style="color:#555;font-size:11px;margin:0;">© 2026 Aashirwad Fashion · Designed by Navneet Kumar Saini</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>`,
    });
    console.log(`✅ Status email sent to ${email}`);
  } catch (err) {
    console.error('❌ Status email failed:', err.message);
  }
};

// Newsletter Welcome Email
const sendNewsletterEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: `"Aashirwad Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 You're subscribed! Here's 10% off your next order`,
      html: `
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#111;padding:40px;text-align:center;border:1px solid #222;">
                <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">Aashirwad Fashion</h1>
                <p style="font-size:40px;margin:20px 0;">📧</p>
                <h2 style="color:#E50010;font-size:22px;margin:0 0 16px;">You're In!</h2>
                <p style="color:#ccc;font-size:15px;margin:0 0 24px;">Thank you for subscribing to Aashirwad Fashion newsletter. Get exclusive deals, new arrivals & style tips!</p>
                <div style="border:1px dashed #E50010;padding:24px;background:#1a0a0a;border-radius:4px;margin-bottom:24px;">
                  <p style="color:#999;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Subscriber Exclusive</p>
                  <p style="color:#E50010;font-size:36px;font-weight:900;letter-spacing:4px;margin:0 0 12px;">10% OFF</p>
                  <div style="background:#0a0a0a;border:1px solid #333;padding:10px 20px;display:inline-block;border-radius:2px;">
                    <p style="color:#fff;font-size:18px;font-weight:700;letter-spacing:6px;font-family:'Courier New',monospace;margin:0;">NEWS10</p>
                  </div>
                </div>
                <a href="https://e-commerce-platform-five-black.vercel.app" style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:14px 40px;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Shop Now</a>
              </td></tr>
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#0a0a0a;padding:20px;text-align:center;border:1px solid #1a1a1a;">
                <p style="color:#555;font-size:11px;margin:0;">© 2026 Aashirwad Fashion · Designed by Navneet Kumar Saini</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>`,
    });
    console.log(`✅ Newsletter email sent to ${email}`);
  } catch (err) {
    console.error('❌ Newsletter email failed:', err.message);
  }
};

// Spin & Win Email
const sendSpinWinEmail = async (email, name, prize) => {
  try {
    await transporter.sendMail({
      from: `"Aashirwad Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎡 You won ${prize}! Claim your reward now`,
      html: `
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#111;padding:40px;text-align:center;border:1px solid #222;">
                <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">Aashirwad Fashion</h1>
                <p style="font-size:50px;margin:20px 0;">🎡</p>
                <h2 style="color:#FFE500;font-size:26px;margin:0 0 8px;">Congratulations, ${name}!</h2>
                <p style="color:#ccc;font-size:15px;margin:0 0 24px;">You spun the wheel and won!</p>
                <div style="border:2px solid #FFE500;padding:24px;background:#1a1500;border-radius:8px;margin-bottom:24px;">
                  <p style="color:#FFE500;font-size:32px;font-weight:900;margin:0;">${prize}</p>
                  <p style="color:#999;font-size:12px;margin:8px 0 0;">Use your coupon code at checkout</p>
                </div>
                <a href="https://e-commerce-platform-five-black.vercel.app" style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:14px 40px;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Shop & Redeem</a>
              </td></tr>
              <tr><td style="height:3px;background:linear-gradient(to right,#E50010,#FF6B6B,#E50010);"></td></tr>
              <tr><td style="background:#0a0a0a;padding:20px;text-align:center;border:1px solid #1a1a1a;">
                <p style="color:#555;font-size:11px;margin:0;">© 2026 Aashirwad Fashion · Designed by Navneet Kumar Saini</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>`,
    });
    console.log(`✅ Spin win email sent to ${email}`);
  } catch (err) {
    console.error('❌ Spin win email failed:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail, sendOrderStatusEmail, sendNewsletterEmail, sendSpinWinEmail };
