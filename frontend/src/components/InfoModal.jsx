import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CONTENT = {
  'FAQ': {
    title: 'Frequently Asked Questions',
    sections: [
      { q: 'How do I place an order?', a: 'Browse our collection, add items to your cart, and proceed to checkout. You need to be logged in to complete a purchase.' },
      { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD) and Online Payment via UPI, Credit/Debit Cards, and Net Banking.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available for select pincodes.' },
      { q: 'Can I track my order?', a: 'Yes! Once your order is shipped, you will receive a tracking link via email. You can also check order status in My Orders.' },
      { q: 'What is the return policy?', a: 'We offer a 15-day easy return policy. Items must be unused, unwashed, and in original packaging with tags intact.' },
      { q: 'Are the sizes true to fit?', a: 'Yes, our sizes follow standard Indian sizing. We recommend checking the Size Guide before ordering.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. After that, the order enters processing and cannot be cancelled.' },
      { q: 'Do you offer gift wrapping?', a: 'Yes! Select the gift wrap option at checkout for a premium gift packaging experience at no extra cost.' },
    ]
  },
  'Shipping & Returns': {
    title: 'Shipping & Returns Policy',
    sections: [
      { heading: 'Shipping Policy' },
      { q: 'Standard Delivery', a: '5–7 business days across India. Free shipping on orders above ₹599.' },
      { q: 'Express Delivery', a: '2–3 business days. Available for major cities at ₹149 extra.' },
      { q: 'Same Day Delivery', a: 'Available in Delhi NCR, Mumbai, and Bangalore for orders placed before 12 PM.' },
      { q: 'International Shipping', a: 'Currently we ship within India only. International shipping coming soon.' },
      { heading: 'Returns Policy' },
      { q: 'Return Window', a: '15 days from the date of delivery. No questions asked.' },
      { q: 'Eligible Items', a: 'Items must be unused, unwashed, with original tags and packaging intact.' },
      { q: 'Non-Returnable Items', a: 'Innerwear, swimwear, and customised products cannot be returned for hygiene reasons.' },
      { q: 'Refund Timeline', a: 'Refunds are processed within 5–7 business days after we receive the returned item.' },
      { q: 'How to Initiate a Return', a: 'Go to My Orders, select the item, and click "Return". Our team will arrange a pickup.' },
    ]
  },
  'Size Guide': {
    title: 'Size Guide',
    sections: [
      { heading: "Women's Sizes" },
      { q: 'XS (Size 32)', a: 'Bust: 32", Waist: 26", Hips: 35"' },
      { q: 'S (Size 34)', a: 'Bust: 34", Waist: 28", Hips: 37"' },
      { q: 'M (Size 36)', a: 'Bust: 36", Waist: 30", Hips: 39"' },
      { q: 'L (Size 38)', a: 'Bust: 38", Waist: 32", Hips: 41"' },
      { q: 'XL (Size 40)', a: 'Bust: 40", Waist: 34", Hips: 43"' },
      { q: 'XXL (Size 42)', a: 'Bust: 42", Waist: 36", Hips: 45"' },
      { heading: "Men's Sizes" },
      { q: 'S (Size 38)', a: 'Chest: 38", Waist: 32", Shoulder: 17"' },
      { q: 'M (Size 40)', a: 'Chest: 40", Waist: 34", Shoulder: 18"' },
      { q: 'L (Size 42)', a: 'Chest: 42", Waist: 36", Shoulder: 18.5"' },
      { q: 'XL (Size 44)', a: 'Chest: 44", Waist: 38", Shoulder: 19"' },
      { q: 'XXL (Size 46)', a: 'Chest: 46", Waist: 40", Shoulder: 19.5"' },
      { heading: 'How to Measure' },
      { q: 'Bust / Chest', a: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.' },
      { q: 'Waist', a: 'Measure around your natural waistline, the narrowest part of your torso.' },
      { q: 'Hips', a: 'Measure around the fullest part of your hips, about 8 inches below your waist.' },
    ]
  },
  'Contact Us': {
    title: 'Contact Us',
    sections: [
      { heading: 'Get in Touch' },
      { q: 'Email', a: 'support@aashirwadfashion.com — We respond within 24 hours.' },
      { q: 'Phone', a: '+91 98765 43210 — Available Mon–Sat, 10 AM to 7 PM IST.' },
      { q: 'WhatsApp', a: '+91 98765 43210 — Chat with us for quick support.' },
      { heading: 'Our Office' },
      { q: 'Address', a: 'Aashirwad Fashion Pvt. Ltd., 42 Fashion Street, Lajpat Nagar, New Delhi – 110024, India.' },
      { q: 'Business Hours', a: 'Monday to Saturday: 10:00 AM – 7:00 PM IST. Closed on Sundays and public holidays.' },
      { heading: 'Social Media' },
      { q: 'Instagram', a: '@aashirwadfashion — Follow us for daily style inspiration and new arrivals.' },
      { q: 'Facebook', a: 'facebook.com/aashirwadfashion — Like our page for exclusive offers.' },
    ]
  },
  'Our Story': {
    title: 'Our Story',
    sections: [
      { heading: 'How It All Began' },
      { q: '2018 — The Beginning', a: 'Aashirwad Fashion was founded with a simple dream: to make premium Indian fashion accessible to everyone. Starting from a small boutique in Delhi, we curated handpicked ethnic and contemporary wear.' },
      { q: '2020 — Going Digital', a: 'We launched our online store during the pandemic, bringing our curated collection to customers across India. Within months, we had served over 10,000 happy customers.' },
      { q: '2022 — Expanding Horizons', a: 'We expanded our catalogue to include men\'s fashion, western wear, and luxury ethnic collections. Our team grew to 50+ passionate fashion enthusiasts.' },
      { q: '2024 — 50,000+ Customers', a: 'Today, Aashirwad Fashion serves over 50,000 customers across 500+ cities in India. We remain committed to quality, style, and value.' },
      { heading: 'Our Mission' },
      { q: 'What Drives Us', a: 'We believe every Indian deserves to dress well without breaking the bank. Our mission is to deliver luxury-feel fashion at honest prices, with exceptional service.' },
      { q: 'Our Values', a: 'Quality first. Customer always. Sustainability matters. We source responsibly and ensure every garment meets our strict quality standards before it reaches you.' },
    ]
  },
  'Sustainability': {
    title: 'Our Sustainability Commitment',
    sections: [
      { heading: 'Our Green Pledge' },
      { q: 'Eco-Friendly Packaging', a: 'All our packaging is 100% recyclable. We use biodegradable mailers and have eliminated single-use plastic from our supply chain.' },
      { q: 'Sustainable Fabrics', a: 'We prioritise organic cotton, recycled polyester, and natural fibres like linen and jute in our collections.' },
      { q: 'Ethical Manufacturing', a: 'All our manufacturing partners are certified for fair wages, safe working conditions, and no child labour.' },
      { heading: 'Carbon Footprint' },
      { q: 'Carbon Neutral Shipping', a: 'We offset 100% of our shipping carbon emissions through certified reforestation projects across India.' },
      { q: 'Local Sourcing', a: 'Over 80% of our fabrics are sourced from Indian weavers and artisans, reducing transportation emissions and supporting local livelihoods.' },
      { heading: 'Our Goals for 2026' },
      { q: 'Zero Waste Production', a: 'We aim to achieve zero fabric waste in production by donating offcuts to NGOs for upcycling.' },
      { q: 'Plant a Tree Programme', a: 'For every order placed, we plant one tree in partnership with the Green India Mission.' },
    ]
  },
  'Careers': {
    title: 'Careers at Aashirwad Fashion',
    sections: [
      { heading: 'Join Our Team' },
      { q: 'Why Work With Us?', a: 'We are a fast-growing fashion brand with a passionate team. We offer competitive salaries, flexible work culture, and the opportunity to shape Indian fashion.' },
      { heading: 'Open Positions' },
      { q: 'Fashion Designer', a: 'Location: Delhi. Experience: 2+ years. Design seasonal collections for our ethnic and contemporary lines.' },
      { q: 'Digital Marketing Manager', a: 'Location: Remote. Experience: 3+ years. Lead our social media, SEO, and performance marketing campaigns.' },
      { q: 'Customer Support Executive', a: 'Location: Delhi / Remote. Experience: 1+ year. Handle customer queries via chat, email, and phone.' },
      { q: 'Full Stack Developer', a: 'Location: Remote. Experience: 2+ years. Build and maintain our e-commerce platform.' },
      { q: 'Warehouse Executive', a: 'Location: Delhi NCR. Experience: 1+ year. Manage inventory, packing, and dispatch operations.' },
      { heading: 'How to Apply' },
      { q: 'Send Your Resume', a: 'Email your CV and portfolio to careers@aashirwadfashion.com with the job title in the subject line. We will get back within 7 business days.' },
    ]
  },
  'Press': {
    title: 'Press & Media',
    sections: [
      { heading: 'In the News' },
      { q: 'Economic Times — March 2024', a: '"Aashirwad Fashion emerges as one of India\'s fastest-growing D2C fashion brands, clocking 300% YoY growth."' },
      { q: 'Vogue India — January 2024', a: '"The brand that\'s making luxury Indian fashion accessible to the masses — Aashirwad Fashion is one to watch."' },
      { q: 'Forbes India — November 2023', a: '"50 Startups to Watch: Aashirwad Fashion\'s founder Navneet Kumar Saini on disrupting Indian fashion retail."' },
      { heading: 'Awards & Recognition' },
      { q: 'Best D2C Fashion Brand 2024', a: 'Awarded by the Indian Retail Forum at their annual gala in Mumbai.' },
      { q: 'Startup of the Year 2023', a: 'Recognised by NASSCOM for innovation in fashion e-commerce.' },
      { heading: 'Media Enquiries' },
      { q: 'Press Contact', a: 'For interviews, collaborations, and press kits, contact: press@aashirwadfashion.com' },
    ]
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Last Updated: January 2025' },
      { q: 'Information We Collect', a: 'We collect your name, email, phone number, shipping address, and payment information when you create an account or place an order.' },
      { q: 'How We Use Your Data', a: 'Your data is used to process orders, send order updates, personalise your shopping experience, and send promotional offers (only if you opt in).' },
      { q: 'Data Security', a: 'All data is encrypted using SSL/TLS. We never store your full card details. Payments are processed through PCI-DSS compliant gateways.' },
      { q: 'Cookies', a: 'We use cookies to remember your preferences, keep you logged in, and analyse site traffic. You can disable cookies in your browser settings.' },
      { q: 'Third-Party Sharing', a: 'We do not sell your personal data. We share data only with delivery partners and payment processors strictly for order fulfilment.' },
      { q: 'Your Rights', a: 'You can request access to, correction of, or deletion of your personal data at any time by emailing privacy@aashirwadfashion.com.' },
      { q: 'Contact', a: 'For privacy concerns: privacy@aashirwadfashion.com' },
    ]
  },
  'Terms & Conditions': {
    title: 'Terms & Conditions',
    sections: [
      { heading: 'Last Updated: January 2025' },
      { q: 'Acceptance of Terms', a: 'By using our website and placing orders, you agree to these Terms & Conditions. Please read them carefully.' },
      { q: 'Account Responsibility', a: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorised access.' },
      { q: 'Product Information', a: 'We strive for accuracy in product descriptions and images. Slight colour variations may occur due to screen settings.' },
      { q: 'Pricing', a: 'All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices without prior notice.' },
      { q: 'Order Acceptance', a: 'An order confirmation email does not constitute acceptance. We reserve the right to cancel orders due to stock unavailability or pricing errors.' },
      { q: 'Intellectual Property', a: 'All content on this website — images, text, logos — is owned by Aashirwad Fashion and may not be reproduced without permission.' },
      { q: 'Governing Law', a: 'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in New Delhi.' },
    ]
  },
  'Cookie Policy': {
    title: 'Cookie Policy',
    sections: [
      { heading: 'What Are Cookies?' },
      { q: 'Definition', a: 'Cookies are small text files stored on your device when you visit our website. They help us provide a better browsing experience.' },
      { heading: 'Types of Cookies We Use' },
      { q: 'Essential Cookies', a: 'Required for the website to function. These include session cookies that keep you logged in and remember your cart.' },
      { q: 'Analytics Cookies', a: 'Help us understand how visitors use our site. We use anonymised data to improve our website performance.' },
      { q: 'Preference Cookies', a: 'Remember your settings like dark/light mode, language, and currency preferences.' },
      { q: 'Marketing Cookies', a: 'Used to show you relevant ads on other platforms. You can opt out at any time.' },
      { heading: 'Managing Cookies' },
      { q: 'Browser Settings', a: 'You can control cookies through your browser settings. Note that disabling essential cookies may affect website functionality.' },
      { q: 'Opt-Out', a: 'To opt out of marketing cookies, email us at privacy@aashirwadfashion.com or use the cookie preferences panel.' },
    ]
  },
};

export default function InfoModal({ page, onClose }) {
  const { theme } = useTheme();
  const content = CONTENT[page];
  if (!content) return null;

  const subColor = theme.colors.background === '#fff'
    ? theme.colors.textSecondary
    : theme.colors.textSecondary;

  return (
    <AnimatePresence>
      {page && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
          />
          {/* Centering wrapper — fixed full screen flex container */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            pointerEvents: 'none',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                width: 'min(720px, 100%)', maxHeight: '85vh',
                background: theme.colors.background, color: theme.colors.text,
                display: 'flex', flexDirection: 'column',
                borderRadius: 4, overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
                pointerEvents: 'all',
              }}
            >
            {/* Header */}
            <div style={{
              padding: '28px 36px 24px',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 6 }}>
                  Aashirwad Fashion
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em', color: theme.colors.text }}>
                  {content.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{ padding: 8, color: theme.colors.text, flexShrink: 0, marginTop: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px 40px' }}>
              {content.sections.map((item, i) => (
                item.heading ? (
                  <p key={i} style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: '#E50010',
                    marginTop: i === 0 ? 0 : 32, marginBottom: 16,
                    paddingBottom: 8, borderBottom: `1px solid ${theme.colors.border}`,
                  }}>
                    {item.heading}
                  </p>
                ) : (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text, marginBottom: 4 }}>
                      {item.q}
                    </p>
                    <p style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 1.7, fontWeight: 300 }}>
                      {item.a}
                    </p>
                  </div>
                )
              ))}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
