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
            <a href="http://localhost:5173" style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:16px 48px;font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">
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
              © 2025 Aashirwad Fashion · New Delhi, India
            </p>
            <p style="margin:0;font-size:11px;color:#333;font-family:Arial,sans-serif;">
              Developed by Navneet Kumar Saini
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

module.exports = { sendWelcomeEmail };
