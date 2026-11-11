// ============================================================
//  SITE CONFIG — Edit this file to change all content, images,
//  and videos on the website. After editing, run:  npm run build
//  (on GitHub, just commit the change and the site rebuilds itself).
// ============================================================

module.exports = {
  // ---- BUSINESS INFO ----
  business: {
    name: "Chef Who Drinks Whiskey",
    tagline: "Private Chef & Catering",
    // PHONE + EMAIL are stored encoded (base64) so they never appear as plain text in the
    // page source or JavaScript bundle, and are only revealed when a visitor taps the button.
    // To change them: open any browser console and run  btoa("new value")  then paste the result.
    //   phone decodes to: (509) 302-5032
    //   email decodes to: gramosg23@gmail.com
    phoneEncoded: "KDUwOSkgMzAyLTUwMzI=",
    emailEncoded: "Z3JhbW9zZzIzQGdtYWlsLmNvbQ==",
    instagram: "https://instagram.com/chefwhodrinkswhiskey",
    yearsInBusiness: 12,
    location: "Serving the Yakima Valley, Tri-Cities, Walla Walla and surrounding areas",
    // Towns shown in the footer and in the search-engine data (both update automatically).
    // Only list places you will actually travel to.
    serviceAreas: ["Yakima", "Sunnyside", "Grandview", "Prosser", "Kennewick", "Richland", "Pasco", "Walla Walla"],
  },

  // ---- HERO SECTION ----
  // Place your video file in the /public folder and reference it here.
  // To change the hero video, just swap the file in /public or change the path below.
  // The posterImage shows before the video loads.
  hero: {
    // IMAGE SIZE: posterImage = 1920 x 1080 px (16:9 landscape), JPG under 300 KB.
    //   The hero fills the whole screen, so keep the subject in the CENTER (edges get cropped
    //   on phones). Video: 1280 x 720 or 1920 x 1080, MP4, ideally under 5 MB.
    // Video file: put your video in /public/hero-video.mp4 (or change path below)
    // Supported formats: .mp4, .webm
    videoSrc: "hero-720p.mp4",
    posterImage: "hero-poster.jpg",
    title: "Chef Who Drinks Whiskey",
    subtitle: "Private Chef & Catering for Meal Preps, Weddings, Quinceañeras, Corporate Events & Intimate Gatherings",
    ctaText: "Get a Free Quote",
    ctaScrollTarget: "contact",
  },

  // ---- ABOUT SECTION ----
  // Change the chef photo by placing an image in /public or update the URL below
  about: {
    // IMAGE SIZE (image): 1200 x 1500 px (4:5 portrait), JPG under 250 KB.
    //   Shown as a near-square on desktop and a taller crop on tablets, so keep the chef's face
    //   and body in the CENTER with some room on the left and right.
    // IMAGE SIZE (video poster): 1920 x 1080 px (16:9 landscape) - it is never cropped.
    title: "Meet The Chef",
    image: "meet-the-chef.jpg",
    paragraphs: [
      "For over a decade, Gabe has been bringing the vibrant flavors of authentic Mexican street food to events across the Yakima Valley, Tri-Cities and Walla Walla. What started as a small taco stand at local farmers' markets grew into a full-service catering operation serving hundreds of events.",
      "From intimate dinners for ten to grand celebrations for five hundred, Gabe brings the same passion, quality ingredients, and attention to detail to every plate. Every tortilla is hand-pressed, every salsa made from scratch, every dish plated with care.",
      "Whether you're planning the wedding of your dreams, a corporate gala, a quinceañera, or an intimate evening with close friends, Gabe crafts a menu that tells your story through food.",
    ],
    // Chef video shown under the story. Place the file in /public.
    // Leave `src` empty ("") to hide the video block entirely.
    // `poster` is optional — the cover image shown before the visitor hits play.
    video: {
      // Starting volume: 0 (silent) to 1 (full). 0.5 = half. Viewers can still change it.
      // Note: iPhones/iPads ignore this and use the device volume buttons.
      volume: 0.5,
      src: "chef-story.mp4",
      poster: "chef-story-poster.jpg",
      title: "Watch Gabe in the kitchen",
      caption: "A look at how Gabe cooks, and why every event gets his full attention.",
    },
  },

  // ---- PHOTO GALLERY (bento grid) ----
  // Exactly 5 images, placed in /public. Update `alt` text to describe each photo.
  // IMAGE SIZES (match these exactly and nothing gets cropped or zoomed):
  //   Images 1 and 2 (wide tiles):     1500 x 1000 px  (3:2 landscape)
  //   Images 3, 4 and 5 (tall tiles):  1000 x 1250 px  (4:5 portrait)
  //   Save as JPG, quality ~80, each under 400 KB.
  // Photos straight from a phone are usually 4:3 or 9:16, so crop them to the shapes above
  // first (any photo editor, or squoosh.app) and keep the main subject near the middle.
  gallery: {
    eyebrow: "Recent Work",
    heading: "A Taste of Our Events",
    intro: "A few highlights from recent catering jobs.",
    images: [
      { src: "gallery-1.jpg", alt: "Catered event spread prepared by Chef Gabe in Tri-Cities, Washington" },
      { src: "gallery-2.jpg", alt: "Plated dish from a catered event in Richland, Washington" },
      { src: "gallery-3.jpg", alt: "Buffet setup at a catered event Yakima, Washington" },
      { src: "gallery-4.jpg", alt: "Guests enjoying food at a catered event in Prosser, Washington" },
      { src: "gallery-5.jpg", alt: "Chef Gabe serving at a catered event Walla Walla, Washington" },
    ],
  },

  // ---- STATS (Years in business, events served, etc.) ----
  stats: [
    { value: "12+", label: "Years of Experience" },
    { value: "850+", label: "Events Catered" },
    { value: "50,000+", label: "Guests Served" },
    { value: "100%", label: "Made From Scratch" },
  ],

  // ---- EVENT PORTFOLIO ----
  // IMAGE SIZE: 1200 x 900 px (4:3 landscape), JPG under 200 KB. Cards show a short wide
  // window (roughly 4:3 to 3:2), so keep the food in the middle of the photo.
  // Each card showcases a type of event. Change images by updating the URL
  // or placing files in /public and referencing them as "/your-image.jpg"
  eventTypes: [
    {
      title: "Elevated Event Catering",
      image: "https://images.pexels.com/photos/37976951/pexels-photo-37976951.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "From soulful Southern comfort and Mediterranean spreads to rich Asian-inspired plates, colorful Mexican dishes, and formal plated dinners, crafted exclusively for your celebration.",
      stat: "200+ events catered",
    },
    {
      title: "Custom Meal Prep",
      image: "https://images.pexels.com/photos/4929677/pexels-photo-4929677.jpeg",
      description: "Tailored to your exact dietary goals and packed with bold, unforgettable flavor. Eat clean without ever compromising on taste.",
      stat: "10,000+ meals prepped",
    },
    {
      title: "Private/Personal Chef",
      image: "https://images.pexels.com/photos/30892994/pexels-photo-30892994.jpeg",
      description: "Bespoke culinary experiences crafted in your home. From intimate dinner parties to weekly custom menus, featuring global flavors tailored precisely to your palate.",
      stat: "300+ plated dinners",
    },
    {
      title: "Private Event Bar Services",
      image: "https://images.pexels.com/photos/36244494/pexels-photo-36244494.jpeg",
      description: "Tailored mixology, curated drink menus, and a seamless bar experience for birthdays, anniversaries, and milestone celebrations.",
      stat: "Tailored drinks for your event",
    },
  ],

  // ---- MONTHLY SPECIAL ----
  // Update these fields each month. Use an image URL or a file in /public
  // (for example: "/monthly-special-october.jpg").
  monthlySpecial: {
    eyebrow: "A Little Something Special",
    heading: "This Month’s Special",
    intro: "Every month brings a new reason to gather around great food. Check back for our latest seasonal offer.",
    badge: "Seasonal feature",
    monthLabel: "October • Fall Gatherings",
    title: "Make Your Fall Gathering Delicious",
    description: "Planning a Halloween get-together, autumn celebration, or cozy family party? Let’s bring the taco bar to your table. Reach out to discuss a menu and catering package tailored to your guest list.",
    // IMAGE SIZE: 1080 x 1350 px (4:5 portrait) is ideal; flyers up to 1080 x 1920 also work.
    //   Never cropped, so any shape fits. Keep text large enough to read on a phone. JPG under 300 KB.
    // Flyer or photo for the card. Shown whole (never cropped) and opens full size when clicked.
    // To switch months, drop the new file in /public and change the filename here.
    //   "special-offer.jpg" = $200 deposit flyer   |   "build-menu.jpg" = Build Your Menu flyer   |   "flash-sale.jpg" = Flash Sale flyer
    image: "flash-sale.jpg",
    imageAlt: "Flash Sale flyer: carne asada cookout, surf and turf bar, and holiday custom menus",
    // Second flyer, shown on the opposite side of the text. Leave secondImage as "" to hide it.
    // Same size advice as above. "special-offer.jpg" = $200 deposit flyer.
    secondImage: "build-menu.jpg",
    secondImageAlt: "Build Your Menu flyer: $20 per guest, 2 entrees, 2 sides and 1 appetizer",
    offerDetails: "Ask about a seasonal menu tailored to your gathering.",
    ctaText: "Ask About This Special",
    ctaTarget: "contact",
  },

  // ---- WHY US SECTION ----
  whyUs: [
    {
      icon: "ChefHat",
      title: "Private/Personal Chef Experience",
      description: "Gabe personally cooks at your event, bringing the kitchen to you. Watch your meal being crafted in real time.",
    },
    {
      icon: "Leaf",
      title: "Fresh, Local Ingredients",
      description: "We source produce from local farms and markets daily. Everything is made from scratch — no shortcuts, no pre-packaged anything.",
    },
    {
      icon: "Users",
      title: "Any Size, Any Venue",
      description: "From 2 guests to 200+, we scale seamlessly. Backyard gatherings, banquet halls, corporate offices — we bring the flavor anywhere.",
    },
    {
      icon: "Flame",
      title: "Authentic Global Flavors",
      description: "From authentic al pastor and hand-pressed tortillas to rich Mediterranean, Asian, and Southern comfort culinary traditions.",
    },
    {
      icon: "CalendarHeart",
      title: "Personalized Planning",
      description: "Every menu is custom-built around your event, dietary needs, and preferences. No cookie-cutter packages.",
    },
    {
      icon: "Award",
      title: "Trusted & Reviewed",
      description: "Hundreds of five-star reviews from satisfied clients. Fully licensed, insured, and catering-safe certified.",
    },
  ],

  // ---- FORMSPREE (contact form submissions) ----
  // 1. Create a form at https://formspree.io and copy its endpoint URL.
  // 2. Paste it below (it looks like https://formspree.io/f/xyzabcde).
  formspree: {
    endpoint: "https://formspree.io/f/xjyyolqz",
  },

  // ---- QUOTE GENERATOR SETTINGS ----
  // Each entry here becomes an option in the Event Type dropdown, in this order.
  //   label    = text shown in the dropdown (and in the Formspree email)
  //   perGuest = price per guest / per person
  //   baseFee  = flat fee added to every quote
  //   minGuests / maxGuests = optional guest limits for that option
  // Quote = (perGuest x number of guests) + baseFee
  quotePricing: {
    event_catering: { label: "Event Catering", perGuest: 25, baseFee: 200, minGuests: 25, maxGuests: 250 },
    meal_prep: { label: "Custom Meal Preps", perGuest: 15, baseFee: 50 },
    personal_chef: { label: "Personal Chef Experience", perGuest: 45, baseFee: 150, minGuests: 2, maxGuests: 25 },
    private_chef: { label: "Private Chef Experience", perGuest: 65, baseFee: 300, minGuests: 2, maxGuests: 25 },
    bar_services: { label: "Private Event Bar Services", perGuest: 18, baseFee: 250, maxGuests: 250 },
    other: { label: "Other", perGuest: 24, baseFee: 150 },
  },

  // ---- UNAVAILABLE DATES (greyed out in the form's date picker) ----
  // Add one line per booked date. Write any note you like, then the date as M/D/YYYY.
  // Only the M/D/YYYY part is used, and the note is stripped at build time, so client
  // names never appear on the public site. Remember the comma at the end.
  //   Example:  "Smith Wedding 1/27/2027",
  blockedDates: [
    "Smith Wedding 1/27/2027",
  ],

  // ---- FOOTER ----
  footer: {
    text: "Bringing authentic flavors to your special moments since 2013.",
  },
};
