/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║               CYBER SHIELD – script.js                      ║
 * ║    Educational phishing-detection game for ages 10–12       ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * TABLE OF CONTENTS
 * ─────────────────
 *  1.  GAME DATA – Missions (5 scenarios)
 *  2.  STORY DATA – ARIA's introduction slides
 *  3.  STATE – Player progress & localStorage
 *  4.  UTILITY HELPERS
 *  5.  SCREEN MANAGER – Show/hide screens
 *  6.  SCREEN 1 – Welcome
 *  7.  SCREEN 2 – Story
 *  8.  SCREEN 3 – Mission Selection
 *  9.  SCREEN 4 – Gameplay
 * 10.  SCREEN 5 – Feedback
 * 11.  SCREEN 6 – Analytics
 * 12.  SCREEN 7 – Tips
 * 13.  SCREEN 8 – Completion
 * 14.  ACHIEVEMENT POPUP
 * 15.  CONFETTI ENGINE
 * 16.  INITIALISATION
 */

'use strict'; // Enable strict mode for cleaner code

/* ═══════════════════════════════════════════════════════════════
   1. GAME DATA – MISSIONS
   Each mission is a complete phishing scenario with educational content.
   Changing data here is all that's needed to add/edit missions.
═══════════════════════════════════════════════════════════════ */
const MISSIONS = [
  {
    /* ── MISSION 1: Fake Gaming Reward ── */
    id: 1,
    title: 'Fake Gaming Reward Scam',
    icon: '🎮',
    difficulty: 'easy',
    difficultyLabel: 'Easy',
    learningObjective: 'Spot fake prize messages in games',
    badge: { emoji: '🎮', name: 'Game Guard' },
    pointsReward: 100,

    /* The fake scam message the player reads */
    message: {
      type: 'Email',
      typeIcon: '📧',
      senderAvatar: '🎮',
      senderName: 'FortBlast Rewards Team',
      senderEmail: 'rewards@fortblast-free-v-bucks.net',
      subject: '🎉 YOU WON 10,000 FREE V-BUCKS! Claim in 10 minutes!',
      body: `Congratulations, Player! 🎉<br><br>
      Our systems have <strong>randomly selected YOU</strong> to receive
      <strong>10,000 FREE V-Bucks</strong> as part of our weekly giveaway!<br><br>
      ⚠️ <strong>WARNING:</strong> Your prize will EXPIRE in 10 minutes if
      you don't act now!<br><br>
      To claim your FREE V-Bucks, click the link below and enter your
      <strong>game username AND password</strong>:<br><br>
      <span class="suspicious-link">👉 http://fortblast-free-v-bucks.net/claim?id=WIN9999</span><br><br>
      You must also share this message with 5 friends to unlock your reward!<br><br>
      Good luck, Champion! 🏆`,
      actionButton: '🎮 CLAIM MY FREE V-BUCKS NOW!'
    },

    /* Red flags to explain after the answer */
    redFlags: [
      'Weird email address: "fortblast-free-v-bucks.net" is not an official game domain',
      'Creates panic with a 10-minute countdown to rush you',
      'Asks for your PASSWORD – real games NEVER do this',
      'Too good to be true: free currency you didn\'t earn',
      'Demands you share with friends (spreading the scam)',
      'Suspicious link with ".net" instead of the real game site'
    ],

    /* Three answer choices */
    choices: [
      { letter: 'A', text: 'Click the link and enter my username and password to get the free V-Bucks!', isCorrect: false },
      { letter: 'B', text: 'This is a SCAM! Delete it, don\'t click anything, and tell a trusted adult.', isCorrect: true },
      { letter: 'C', text: 'Share it with 5 friends so we can all get the free V-Bucks!', isCorrect: false }
    ],
    correctIndex: 1, // B is correct

    /* Explanations and tips shown after answer */
    explanation: 'This is a classic phishing scam! Real gaming companies NEVER email you asking for your password or rushing you with countdowns. The email address "fortblast-free-v-bucks.net" is NOT an official game domain – scammers make it look almost real to trick you.',
    safetyTip: 'Free prizes you didn\'t enter for are almost always scams. Real gaming rewards appear INSIDE the game app itself, not in surprise emails. If you\'re unsure, ask a parent or guardian!',
    hint: '🔍 Look closely at the sender\'s email address. Does it end in an official domain? And why would they need your password to give you something free?',

    ariaGuide: 'Hmm, someone sent you a message about free gaming prizes! Read it carefully before you decide what to do… 🤔'
  },

  {
    /* ── MISSION 2: Fake Bank Message ── */
    id: 2,
    title: 'Fake Bank Message',
    icon: '🏦',
    difficulty: 'medium',
    difficultyLabel: 'Medium',
    learningObjective: 'Identify fake bank security alerts',
    badge: { emoji: '🏦', name: 'Bank Blocker' },
    pointsReward: 150,

    message: {
      type: 'Email',
      typeIcon: '📧',
      senderAvatar: '🏦',
      senderName: 'SafeBank Security Team',
      senderEmail: 'security-alert@safebank-verify.com',
      subject: '⚠️ URGENT: Your account has been SUSPENDED – Verify Now',
      body: `Dear Valued Customer,<br><br>
      We have detected <strong>suspicious activity</strong> on your SafeBank account.
      To protect your money, we have <strong>temporarily suspended</strong> your account.<br><br>
      ⚠️ You must verify your identity within <strong>24 hours</strong> or your
      account will be <strong>permanently closed</strong> and your funds frozen.<br><br>
      Please click below and provide:<br>
      • Your <strong>full name and date of birth</strong><br>
      • Your <strong>account number and sort code</strong><br>
      • Your <strong>online banking password</strong><br>
      • Your <strong>card PIN number</strong><br><br>
      <span class="suspicious-link">🔗 http://safebank-verify.com/secure-login</span><br><br>
      Failure to verify will result in permanent account closure.<br><br>
      SafeBank Security Department`,
      actionButton: '🔒 VERIFY MY ACCOUNT NOW'
    },

    redFlags: [
      'Email comes from "safebank-verify.com" – NOT an official bank domain',
      'Creates extreme urgency: "24 hours or account closed"',
      'Asks for your FULL banking details including PASSWORD and PIN',
      'Real banks never ask for your PIN – ever, by any method',
      'Threatening language: "permanently closed", "funds frozen"',
      'Suspicious link doesn\'t match an official bank website'
    ],

    choices: [
      { letter: 'A', text: 'Click the link immediately and enter all my details to save my account!', isCorrect: false },
      { letter: 'B', text: 'Call the number on the BACK of my bank card and ask if this is real. Don\'t click anything in the email.', isCorrect: true },
      { letter: 'C', text: 'Forward the email to my parents so they can verify for me.', isCorrect: false }
    ],
    correctIndex: 1,

    explanation: 'This is a bank phishing scam called "vishing." No real bank will EVER ask for your full PIN or password via email. The sender\'s address "safebank-verify.com" is fake. When in doubt about a bank message, always call the official number on the back of your card – never use the number in a suspicious email.',
    safetyTip: 'Real banks NEVER ask for your PIN, full password, or all your security details in an email. If you\'re worried about your account, always call the bank\'s official number (from the back of the card or their real website) – never use contact details from a suspicious email.',
    hint: '🔍 Would a real bank ask for your PIN and password in an email? And look at the sender\'s email domain – is it really from your bank?',

    ariaGuide: 'Whoa! Someone says your bank account is in danger! Stay calm and think carefully before doing anything… 🧐'
  },

  {
    /* ── MISSION 3: QR Code Scam ── */
    id: 3,
    title: 'Suspicious QR Code',
    icon: '📱',
    difficulty: 'medium',
    difficultyLabel: 'Medium',
    learningObjective: 'Be careful with QR codes in public',
    badge: { emoji: '📱', name: 'QR Quizzer' },
    pointsReward: 150,

    message: {
      type: 'Poster (Photo)',
      typeIcon: '📸',
      senderAvatar: '📋',
      senderName: 'Flyer found at school',
      senderEmail: 'Unknown creator',
      subject: '🎁 Scan to WIN a brand new iPhone 15!',
      body: `<strong style="font-size:1.2em">📲 SCAN ME TO WIN!</strong><br><br>
      We are giving away <strong>10 brand new iPhone 15 Pro devices</strong>
      to celebrate our 1,000,000th follower milestone!<br><br>
      <strong>HOW TO WIN:</strong><br>
      1. Scan the QR code below 📱<br>
      2. Enter your <strong>name, address, and phone number</strong><br>
      3. Verify by entering your <strong>parent's credit card number</strong><br>
      4. Share with 3 friends!<br><br>
      🔲 [<em>Imagine a QR code sticker here, stuck over the original</em>] 🔲<br><br>
      ⏰ Offer ends TODAY! Only 3 prizes remaining!<br><br>
      <span class="suspicious-link">Scans to: http://free-iphone-win.xyz/claim</span>`,
      actionButton: '📱 SCAN & WIN!'
    },

    redFlags: [
      'QR code sticker placed OVER another QR code – a classic swap trick',
      'URL leads to a suspicious ".xyz" domain, not a real company site',
      'Asks for your home ADDRESS – that\'s dangerous personal information',
      'Asks for a parent\'s CREDIT CARD number – real giveaways never do this',
      'Extreme urgency: "ends TODAY", "only 3 left"',
      'A prize you didn\'t enter for – too good to be true'
    ],

    choices: [
      { letter: 'A', text: 'Scan it immediately – free iPhone sounds amazing and I want to win!', isCorrect: false },
      { letter: 'B', text: 'Don\'t scan it. Tell a teacher or trusted adult. It asks for personal and payment information which is a scam.', isCorrect: true },
      { letter: 'C', text: 'Scan it but only share my name, not my address or card details.', isCorrect: false }
    ],
    correctIndex: 1,

    explanation: 'Scammers place fake QR code stickers over real ones in public places like schools, cafes, and shops. This QR code asks for your home address AND a credit card number – which are huge red flags. Legitimate competitions NEVER ask for payment details to claim a prize. A ".xyz" web address is not a real company website.',
    safetyTip: 'Before scanning any QR code, check if it looks like a sticker placed over something else. Never scan random QR codes in public. And remember: if winning a prize requires payment, personal details, or a credit card – it\'s a scam!',
    hint: '🔍 Real competitions never ask for your home address AND a credit card number. What happens to the web address when you scan this code?',

    ariaGuide: 'Look at this flyer someone found at school! There\'s a QR code on it. Should we scan it? Let\'s think about this carefully… 🤔'
  },

  {
    /* ── MISSION 4: Social Media Giveaway Scam ── */
    id: 4,
    title: 'Fake Social Media Giveaway',
    icon: '📲',
    difficulty: 'hard',
    difficultyLabel: 'Hard',
    learningObjective: 'Spot fake celebrity giveaways online',
    badge: { emoji: '📲', name: 'Social Savvy' },
    pointsReward: 200,

    message: {
      type: 'Social Media DM',
      typeIcon: '💬',
      senderAvatar: '⭐',
      senderName: 'Taylor.Swift.Official99',
      senderEmail: '@Taylor.Swift.Official99 (not verified ✗)',
      subject: 'DM from: Taylor.Swift.Official99',
      body: `OMG hi!! 💕<br><br>
      I'm doing a <strong>SECRET GIVEAWAY</strong> just for my true fans!
      I'm giving away <strong>signed merch + concert tickets</strong>
      to 50 lucky fans TODAY ONLY! 🎤🎵<br><br>
      To enter, you just need to:<br>
      ✅ Follow this account<br>
      ✅ Send me <strong>£5 via PayPal</strong> to "cover shipping costs"<br>
      ✅ Send me your <strong>full name, address, and phone number</strong><br>
      ✅ Keep this DM <strong>SECRET</strong> – don't tell your parents,
      it's a fan surprise! 🤫<br><br>
      Send payment to: <span class="suspicious-link">paypal.me/TaylorGifts99</span><br><br>
      This offer disappears in 2 HOURS! 💌`,
      actionButton: '💌 CLAIM MY PRIZE'
    },

    redFlags: [
      'Account is NOT verified (no blue tick) and has a weird name like "Official99"',
      'Asks you to SEND MONEY "for shipping" – real prizes are always free',
      'Tells you to KEEP IT SECRET from parents – huge grooming/scam warning sign',
      'Real celebrities don\'t DM random fans offering secret prizes',
      'Asks for your home ADDRESS and phone number',
      'Extreme time pressure: "2 HOURS only"',
      'Payment goes to a personal PayPal, not a business account'
    ],

    choices: [
      { letter: 'A', text: 'Send the £5 and my details – it\'s only £5 and the prizes are worth so much more!', isCorrect: false },
      { letter: 'B', text: 'Keep it secret as they asked and just follow the account for now.', isCorrect: false },
      { letter: 'C', text: 'This is a scam! The "keep it secret" part is a massive red flag. Tell a parent immediately and block the account.', isCorrect: true }
    ],
    correctIndex: 2,

    explanation: 'This is a celebrity impersonation scam. The account is not verified and uses a suspicious name. The BIGGEST red flag? They say "don\'t tell your parents." Real companies, real celebrities, and genuine competitions will NEVER ask you to keep something secret from your parents. Anyone who says that is trying to trick or harm you.',
    safetyTip: 'Any message that asks you to keep it secret from your parents or guardians is a MAJOR warning sign – always tell a trusted adult immediately. Real giveaways never ask you to pay "shipping fees" and real celebrities have verified accounts with blue ticks.',
    hint: '🔍 Why would a real celebrity ask you to keep something secret from your parents? And check – does the account have a blue verification tick?',

    ariaGuide: 'Wow, someone is claiming to be a famous celebrity offering prizes! But something feels really strange here… What do you notice? 👀'
  },

  {
    /* ── MISSION 5: SMS Scam ── */
    id: 5,
    title: 'Fake Delivery SMS Scam',
    icon: '📦',
    difficulty: 'hard',
    difficultyLabel: 'Hard',
    learningObjective: 'Recognise fake parcel delivery texts',
    badge: { emoji: '📦', name: 'Delivery Defender' },
    pointsReward: 200,

    message: {
      type: 'SMS / Text Message',
      typeIcon: '📱',
      senderAvatar: '📦',
      senderName: 'Royal-Parcel-UK',
      senderEmail: '+44 7700 900123 (unknown number)',
      subject: 'Text Message',
      body: `<strong>Royal Parcel UK:</strong><br><br>
      We tried to deliver your parcel but nobody was home. 📦<br><br>
      Your package (ref: RP-8847291) is being held at our depot.
      A <strong>£1.99 redelivery fee</strong> must be paid within
      <strong>48 hours</strong> or it will be returned to sender.<br><br>
      Pay here to reschedule delivery:<br>
      <span class="suspicious-link">http://royalparcel-redeliver.uk/pay</span><br><br>
      If you did not order anything, STILL click the link to
      "refuse delivery" or you may be charged.<br><br>
      Reply STOP to cancel.`,
      actionButton: '💳 Pay £1.99 Redelivery Fee'
    },

    redFlags: [
      'You didn\'t order anything – how would they have your number?',
      'Uses a suspicious website: "royalparcel-redeliver.uk" is not the real Royal Mail',
      'Asks for payment via a link in a text – real delivery companies use official apps/websites',
      'The trick line: "even if you didn\'t order anything, click the link" – trying to get everyone to click',
      '48-hour urgency to create panic',
      'Comes from an unknown mobile number, not a short official code',
      '"Reply STOP" – a trick to confirm your number is active'
    ],

    choices: [
      { letter: 'A', text: 'Click the link and pay the £1.99 – it\'s only £1.99 and I don\'t want to miss my parcel!', isCorrect: false },
      { letter: 'B', text: 'Click "refuse delivery" since I didn\'t order anything – I need to protect myself!', isCorrect: false },
      { letter: 'C', text: 'Don\'t click anything. Check any real deliveries by going directly to the official Royal Mail website. Tell a trusted adult.', isCorrect: true }
    ],
    correctIndex: 2,

    explanation: 'This is a "smishing" scam (SMS phishing). The clever trick here is telling you to click the link EVEN if you didn\'t order anything – they\'re trying to get everyone to click. Never follow links in unsolicited texts. If you\'re expecting a parcel, go directly to the official delivery company website by typing it yourself.',
    safetyTip: 'Never click links in text messages from unknown numbers. To check a real delivery, go DIRECTLY to the official website (like royalmail.com) by typing it yourself – not by clicking a link in a text. Real delivery fees are never collected via random text links.',
    hint: '🔍 Did you actually order a parcel? And why would they tell you to click the link EVEN if you didn\'t order anything? That\'s a suspicious trick!',

    ariaGuide: 'You just got a text about a parcel delivery! But wait… did you actually order anything? Let\'s look at this message very carefully… 🧐'
  }
];


/* ═══════════════════════════════════════════════════════════════
   2. STORY DATA – ARIA'S INTRODUCTION SLIDES
   Array of text content shown step by step on Screen 2
═══════════════════════════════════════════════════════════════ */
const STORY_SLIDES = [
  {
    text: `👋 Hi there! I'm <strong>ARIA</strong> – your Artificial Resilience & Intelligence Agent!<br><br>
    I'm here to teach you how to stay <strong>SAFE online</strong> and spot the sneaky tricks that scammers use! 🛡️`
  },
  {
    text: `🤔 Did you know that <strong>phishing</strong> is when someone online pretends to be someone they're not – to steal your information or money?<br><br>
    Scammers can pretend to be banks, game companies, celebrities, or even delivery services!`
  },
  {
    text: `🎯 Today, I need your help with <strong>5 urgent missions!</strong><br><br>
    Scammers are sending fake messages to children, and YOU need to read them carefully and decide if they're REAL or FAKE. Can you handle it? 💪`
  },
  {
    text: `🌟 As you complete missions, you'll earn <strong>badges</strong>, score <strong>points</strong>, and become a real <strong>Cyber Hero!</strong><br><br>
    Remember: there's always a hint if you get stuck. Let's go! 🚀`
  }
];


/* ═══════════════════════════════════════════════════════════════
   3. STATE – PLAYER PROGRESS & LOCALSTORAGE
   All game state lives in this object; saved/loaded via localStorage
═══════════════════════════════════════════════════════════════ */

/** Key used to save progress in localStorage */
const STORAGE_KEY = 'cyberShieldProgress_v1';

/**
 * Default empty state – used when no saved game exists
 * @returns {Object} fresh game state
 */
function getDefaultState() {
  return {
    score: 0,                    // Total points accumulated
    missionsCompleted: [],       // Array of mission IDs completed successfully
    missionsAttempted: {},       // { missionId: { correct: bool, attempts: n } }
    badgesEarned: [],            // Array of badge names earned
    totalAttempts: 0,            // Total answers given (for accuracy %)
    correctAnswers: 0,           // Number of correct answers
    currentMission: null,        // ID of mission currently being played
    lastPlayed: null             // ISO date string of last session
  };
}

/** The live game state – all mutations happen here */
let gameState = getDefaultState();

/** Currently active mission object (reference to MISSIONS array item) */
let activeMission = null;

/** Current story slide index */
let storySlideIndex = 0;

/** Whether the player has already answered the current question */
let hasAnswered = false;

/**
 * Loads saved state from localStorage, merging with defaults
 * so new fields added in updates don't break old saves
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved data with defaults (handles new fields gracefully)
      gameState = Object.assign(getDefaultState(), parsed);
    }
  } catch (err) {
    // localStorage might be blocked in some browsers/contexts
    console.warn('Could not load saved progress:', err);
    gameState = getDefaultState();
  }
}

/**
 * Saves current gameState to localStorage
 */
function saveState() {
  try {
    gameState.lastPlayed = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (err) {
    console.warn('Could not save progress:', err);
  }
}

/**
 * Resets all progress to a fresh default state
 */
function resetState() {
  gameState = getDefaultState();
  saveState();
}


/* ═══════════════════════════════════════════════════════════════
   4. UTILITY HELPERS
═══════════════════════════════════════════════════════════════ */

/**
 * Announces a message to screen readers via the live region
 * @param {string} message - Text to announce
 */
function announceToScreenReader(message) {
  const el = document.getElementById('sr-announcer');
  if (!el) return;
  // Clear then set to trigger announcement even if message is the same
  el.textContent = '';
  setTimeout(() => { el.textContent = message; }, 50);
}

/**
 * Sets focus to a given element (accessibility – after screen change)
 * @param {string} selector - CSS selector for element to focus
 */
function setFocus(selector) {
  setTimeout(() => {
    const el = document.querySelector(selector);
    if (el) {
      el.focus();
      // If it's a non-focusable element, make it temporarily focusable
      if (!el.matches('button, input, select, a, [tabindex]')) {
        el.tabIndex = -1;
        el.focus();
      }
    }
  }, 100);
}

/**
 * Calculates accuracy percentage from state
 * @returns {string} e.g. "75%"
 */
function getAccuracy() {
  if (gameState.totalAttempts === 0) return '0%';
  const pct = Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100);
  return `${pct}%`;
}

/**
 * Gets the CSS class for a difficulty level
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {string} CSS class name
 */
function getDifficultyClass(difficulty) {
  return `difficulty-${difficulty}`;
}

/**
 * Returns the colour for a difficulty chip emoji
 * @param {string} difficulty
 * @returns {string}
 */
function getDifficultyEmoji(difficulty) {
  const map = { easy: '🟢', medium: '🟡', hard: '🔴' };
  return map[difficulty] || '⚪';
}

/**
 * Checks if all 5 missions are completed
 * @returns {boolean}
 */
function isGameComplete() {
  return gameState.missionsCompleted.length >= MISSIONS.length;
}

/**
 * Checks if a specific mission is completed
 * @param {number} missionId
 * @returns {boolean}
 */
function isMissionCompleted(missionId) {
  return gameState.missionsCompleted.includes(missionId);
}

/**
 * Gets the first incomplete mission ID (for "next mission" logic)
 * @returns {number|null} next mission id or null if all done
 */
function getNextMissionId() {
  const completed = new Set(gameState.missionsCompleted);
  for (const m of MISSIONS) {
    if (!completed.has(m.id)) return m.id;
  }
  return null;
}


/* ═══════════════════════════════════════════════════════════════
   5. SCREEN MANAGER
   Central function to show/hide screens and manage transitions
═══════════════════════════════════════════════════════════════ */

/**
 * Switches to a named screen, hiding all others
 * @param {string} screenId - ID of screen to show (without 'screen-' prefix)
 */
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.setAttribute('aria-hidden', 'true');
  });

  // Show target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
    target.removeAttribute('aria-hidden');

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    console.error(`Screen not found: screen-${screenId}`);
  }
}


/* ═══════════════════════════════════════════════════════════════
   6. SCREEN 1 – WELCOME
═══════════════════════════════════════════════════════════════ */

/** Renders the welcome screen and hooks up its buttons */
function initWelcomeScreen() {
  // Show saved progress badge if game has been played before
  const progressBadge = document.getElementById('welcome-progress-badge');
  const progressText  = document.getElementById('welcome-progress-text');

  if (gameState.missionsCompleted.length > 0) {
    progressBadge.classList.remove('hidden');
    progressText.textContent =
      `Progress saved! Score: ${gameState.score} pts · ${gameState.missionsCompleted.length}/5 missions done`;
  } else {
    progressBadge.classList.add('hidden');
  }

  // Play / Start button
  document.getElementById('btn-start').addEventListener('click', () => {
    // If player has completed missions, go straight to missions screen
    if (gameState.missionsCompleted.length > 0) {
      renderMissionSelection();
      showScreen('missions');
    } else {
      // First time player – show story intro
      initStoryScreen();
      showScreen('story');
    }
    announceToScreenReader('Starting game');
  });

  // Safety Tips button
  document.getElementById('btn-tips').addEventListener('click', () => {
    showScreen('tips');
    setFocus('#tips-title');
    announceToScreenReader('Safety tips page');
  });

  // Progress button
  document.getElementById('btn-progress').addEventListener('click', () => {
    renderAnalyticsScreen();
    showScreen('analytics');
    setFocus('#analytics-title');
    announceToScreenReader('Your progress page');
  });
}


/* ═══════════════════════════════════════════════════════════════
   7. SCREEN 2 – STORY (ARIA Introduction)
═══════════════════════════════════════════════════════════════ */

/** Sets up the story introduction screen */
function initStoryScreen() {
  storySlideIndex = 0;
  renderStorySlide();

  // Generate step dots
  const dotsContainer = document.getElementById('story-dots');
  dotsContainer.innerHTML = '';
  STORY_SLIDES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `story-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1} of ${STORY_SLIDES.length}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dotsContainer.appendChild(dot);
  });

  // Next button
  const btnNext = document.getElementById('btn-story-next');
  // Remove previous event listeners by cloning the element
  const newBtnNext = btnNext.cloneNode(true);
  btnNext.parentNode.replaceChild(newBtnNext, btnNext);
  newBtnNext.addEventListener('click', advanceStory);

  // Skip button
  const btnSkip = document.getElementById('btn-story-skip');
  const newBtnSkip = btnSkip.cloneNode(true);
  btnSkip.parentNode.replaceChild(newBtnSkip, btnSkip);
  newBtnSkip.addEventListener('click', () => {
    renderMissionSelection();
    showScreen('missions');
    setFocus('#missions-title');
  });
}

/** Renders the current story slide text */
function renderStorySlide() {
  const textEl = document.getElementById('story-text');
  const slide  = STORY_SLIDES[storySlideIndex];
  textEl.innerHTML = slide.text;
  announceToScreenReader(`Story slide ${storySlideIndex + 1}: ${textEl.textContent}`);

  // Update dots
  document.querySelectorAll('.story-dot').forEach((dot, i) => {
    const isActive = i === storySlideIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update next button text on last slide
  const nextBtn = document.getElementById('btn-story-next');
  if (nextBtn) {
    nextBtn.textContent = storySlideIndex === STORY_SLIDES.length - 1
      ? '🚀 Start Missions!'
      : 'Next ➡️';
  }
}

/** Advances to the next story slide or proceeds to missions */
function advanceStory() {
  storySlideIndex++;
  if (storySlideIndex >= STORY_SLIDES.length) {
    // Story complete – go to missions
    renderMissionSelection();
    showScreen('missions');
    setFocus('#missions-title');
  } else {
    renderStorySlide();
  }
}


/* ═══════════════════════════════════════════════════════════════
   8. SCREEN 3 – MISSION SELECTION
═══════════════════════════════════════════════════════════════ */

/** Renders all mission cards in the grid */
function renderMissionSelection() {
  // Update score display
  document.getElementById('score-display').textContent = gameState.score;

  const grid = document.getElementById('missions-grid');
  grid.innerHTML = '';

  MISSIONS.forEach((mission, index) => {
    const isCompleted = isMissionCompleted(mission.id);
    const attemptData = gameState.missionsAttempted[mission.id];

    // Build the card element
    const card = document.createElement('div');
    card.className = `mission-card${isCompleted ? ' completed' : ''}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${index * 0.08}s`;

    // ARIA label for the card
    const statusLabel = isCompleted ? 'Completed' : 'Available';
    card.setAttribute('aria-label',
      `Mission ${mission.id}: ${mission.title}. ${statusLabel}. Difficulty: ${mission.difficultyLabel}. ${mission.learningObjective}`
    );

    card.innerHTML = `
      <div class="mission-icon-wrap" aria-hidden="true">${mission.icon}</div>
      <div class="mission-info">
        <div class="mission-card-title">
          Mission ${mission.id}: ${mission.title}
        </div>
        <div class="mission-card-objective">${mission.learningObjective}</div>
        <span class="mission-difficulty ${getDifficultyClass(mission.difficulty)}">
          ${getDifficultyEmoji(mission.difficulty)} ${mission.difficultyLabel}
        </span>
        ${isCompleted ? `<span class="mission-difficulty difficulty-easy" style="margin-left:4px">✓ Done · ${attemptData ? attemptData.score : 0} pts</span>` : ''}
      </div>
    `;

    // Click and keyboard handlers
    const startMission = () => {
      loadMission(mission.id);
      showScreen('game');
      setFocus('#game-mission-title');
    };

    card.addEventListener('click', startMission);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startMission();
      }
    });

    grid.appendChild(card);
  });

  // Back button
  const backBtn = document.getElementById('btn-missions-back');
  // Clone to remove old listeners
  const newBack = backBtn.cloneNode(true);
  backBtn.parentNode.replaceChild(newBack, backBtn);
  newBack.addEventListener('click', () => {
    initWelcomeScreen();
    showScreen('welcome');
  });
}


/* ═══════════════════════════════════════════════════════════════
   9. SCREEN 4 – GAMEPLAY
═══════════════════════════════════════════════════════════════ */

/**
 * Loads a mission and sets up the gameplay screen
 * @param {number} missionId - ID of the mission to load
 */
function loadMission(missionId) {
  // Find the mission object
  activeMission = MISSIONS.find(m => m.id === missionId);
  if (!activeMission) {
    console.error('Mission not found:', missionId);
    return;
  }

  // Reset answer state
  hasAnswered = false;
  gameState.currentMission = missionId;

  const m = activeMission;

  // ── Populate top bar ──
  document.getElementById('game-mission-number').textContent = `Mission ${m.id} of ${MISSIONS.length}`;
  document.getElementById('game-mission-title').textContent  = m.title;
  document.getElementById('game-score').textContent          = gameState.score;

  // Difficulty chip
  const diffChip = document.getElementById('difficulty-chip');
  diffChip.textContent = `${getDifficultyEmoji(m.difficulty)} ${m.difficultyLabel}`;

  // ── ARIA guidance text ──
  document.getElementById('aria-guide-text').textContent = m.ariaGuide;

  // ── Build the scam message card ──
  const msg = m.message;

  // Type bar
  document.getElementById('message-type-icon').textContent  = msg.typeIcon;
  document.getElementById('message-type-label').textContent = msg.type;

  // Sender info
  document.getElementById('message-sender-avatar').textContent = msg.senderAvatar;
  document.getElementById('message-sender-name').textContent   = msg.senderName;
  document.getElementById('message-sender-addr').textContent   = msg.senderEmail;

  // Subject
  document.getElementById('message-subject').textContent = msg.subject;

  // Body (allow HTML for red-flag highlights)
  document.getElementById('message-body').innerHTML = msg.body;

  // Action button (fake / disabled)
  const actionsEl = document.getElementById('message-actions');
  if (msg.actionButton) {
    actionsEl.innerHTML = `
      <button class="fake-btn" disabled aria-label="This button is fake and disabled for your safety" tabindex="-1">
        ${msg.actionButton}
      </button>
    `;
  } else {
    actionsEl.innerHTML = '';
  }

  // ── Hint button ──
  const hintBtn = document.getElementById('btn-hint');
  const hintBox = document.getElementById('hint-box');

  // Clone to remove stale listeners
  const newHintBtn = hintBtn.cloneNode(true);
  hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

  hintBox.classList.add('hidden');
  hintBox.innerHTML = `<strong>💡 ARIA's Hint:</strong> ${m.hint}`;

  newHintBtn.setAttribute('aria-expanded', 'false');
  newHintBtn.addEventListener('click', () => {
    const isHidden = hintBox.classList.contains('hidden');
    hintBox.classList.toggle('hidden', !isHidden);
    newHintBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    if (isHidden) {
      announceToScreenReader(`Hint: ${m.hint}`);
    }
  });

  // ── Build answer choices ──
  const choicesContainer = document.getElementById('answer-choices');
  // Rebuild choices label + buttons
  choicesContainer.innerHTML = `
    <h2 id="choices-label" class="choices-label">What should you do?</h2>
  `;

  m.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', `Choice ${choice.letter}: ${choice.text}`);
    btn.style.animationDelay = `${idx * 0.1}s`;

    btn.innerHTML = `
      <span class="choice-letter" aria-hidden="true">${choice.letter}</span>
      <span class="choice-text">${choice.text}</span>
    `;

    btn.addEventListener('click', () => handleAnswer(idx));
    choicesContainer.appendChild(btn);
  });
}

/**
 * Handles the player selecting an answer
 * @param {number} selectedIndex - Index of chosen answer in m.choices
 */
function handleAnswer(selectedIndex) {
  // Prevent double-answering
  if (hasAnswered) return;
  hasAnswered = true;

  const m = activeMission;
  const isCorrect = selectedIndex === m.correctIndex;

  // Update stats
  gameState.totalAttempts++;
  if (isCorrect) {
    gameState.correctAnswers++;
  }

  // Disable all choice buttons
  const choiceBtns = document.querySelectorAll('.choice-btn');
  choiceBtns.forEach((btn, idx) => {
    btn.disabled = true;
    // Highlight correct and wrong answers
    if (idx === m.correctIndex) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add('wrong');
    }
    btn.setAttribute('aria-disabled', 'true');
  });

  // Announce result to screen reader
  announceToScreenReader(isCorrect
    ? `Correct! Well done! ${m.pointsReward} points earned.`
    : `Incorrect. The correct answer was: ${m.choices[m.correctIndex].text}`
  );

  // Update ARIA guidance text
  const ariaText = document.getElementById('aria-guide-text');
  if (isCorrect) {
    ariaText.textContent = '🎉 Excellent work! You spotted the scam! Let me explain why…';
  } else {
    ariaText.textContent = '🤔 Hmm, that wasn\'t quite right. Let\'s learn from this!';
  }

  // Short delay then show feedback
  setTimeout(() => {
    showFeedback(isCorrect);
  }, 1200);
}


/* ═══════════════════════════════════════════════════════════════
   10. SCREEN 5 – FEEDBACK
═══════════════════════════════════════════════════════════════ */

/**
 * Displays the feedback screen after an answer
 * @param {boolean} isCorrect - Whether player answered correctly
 */
function showFeedback(isCorrect) {
  const m = activeMission;

  // Record mission result in state
  const prevAttempt = gameState.missionsAttempted[m.id] || { attempts: 0, score: 0 };
  const pointsEarned = isCorrect ? m.pointsReward : 0;

  gameState.missionsAttempted[m.id] = {
    correct: isCorrect,
    attempts: prevAttempt.attempts + 1,
    score: Math.max(prevAttempt.score, pointsEarned)
  };

  // Add score and mark as completed if correct
  if (isCorrect && !isMissionCompleted(m.id)) {
    gameState.score += m.pointsReward;
    gameState.missionsCompleted.push(m.id);

    // Award badge if not already earned
    if (!gameState.badgesEarned.includes(m.badge.name)) {
      gameState.badgesEarned.push(m.badge.name);
    }
  }

  saveState();

  // ── Populate feedback screen ──
  const icon       = document.getElementById('feedback-icon');
  const title      = document.getElementById('feedback-title');
  const pointsEl   = document.getElementById('feedback-points');
  const explainEl  = document.getElementById('feedback-explanation');
  const tipEl      = document.getElementById('feedback-safety-tip');
  const flagsSect  = document.getElementById('red-flags-section');
  const flagsList  = document.getElementById('red-flags-list');

  if (isCorrect) {
    icon.textContent  = '🎉';
    title.textContent = 'Correct!';
    title.className   = 'feedback-title correct';
    pointsEl.textContent = `+${m.pointsReward} points ⭐`;
    pointsEl.style.display = 'inline-block';

    // Show red flags section
    flagsSect.classList.remove('hidden');
    flagsList.innerHTML = m.redFlags.map(f => `<li>${f}</li>`).join('');
  } else {
    icon.textContent  = '😮';
    title.textContent = 'Not Quite!';
    title.className   = 'feedback-title wrong';
    pointsEl.textContent = `Correct answer: ${m.choices[m.correctIndex].letter}`;
    pointsEl.style.background = '#ffe0e0';
    pointsEl.style.color = '#c0392b';

    // Hide red flags – don't overwhelm with wrong info
    flagsSect.classList.add('hidden');
  }

  explainEl.innerHTML = m.explanation;
  tipEl.innerHTML     = m.safetyTip;

  // ── Navigation buttons ──
  const nextBtn   = document.getElementById('btn-next-mission');
  const replayBtn = document.getElementById('btn-replay-mission');

  // Clone to remove stale listeners
  const newNextBtn   = nextBtn.cloneNode(true);
  const newReplayBtn = replayBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  replayBtn.parentNode.replaceChild(newReplayBtn, replayBtn);

  // Check if game is complete
  if (isGameComplete()) {
    newNextBtn.textContent = '🏆 See Your Certificate!';
    newNextBtn.setAttribute('aria-label', 'View your completion certificate');
    newNextBtn.addEventListener('click', () => {
      showCompletionScreen();
    });
  } else {
    const nextId = getNextMissionId();
    newNextBtn.textContent = nextId ? `Next Mission ➡️` : '🗺️ Mission Select';
    newNextBtn.setAttribute('aria-label', nextId ? 'Go to next mission' : 'Go to mission selection');
    newNextBtn.addEventListener('click', () => {
      if (nextId) {
        loadMission(nextId);
        showScreen('game');
      } else {
        renderMissionSelection();
        showScreen('missions');
      }
    });
  }

  newReplayBtn.addEventListener('click', () => {
    loadMission(m.id);
    showScreen('game');
  });

  // Switch to feedback screen
  showScreen('feedback');
  setFocus('#feedback-title');

  // Show achievement popup if badge just earned
  if (isCorrect && gameState.badgesEarned.includes(m.badge.name)) {
    setTimeout(() => {
      showAchievementPopup(m.badge);
    }, 600);
  }
}


/* ═══════════════════════════════════════════════════════════════
   11. SCREEN 6 – ANALYTICS
═══════════════════════════════════════════════════════════════ */

/** Renders the analytics / progress screen */
function renderAnalyticsScreen() {
  // Overall stats
  document.getElementById('stat-score').textContent    = gameState.score;
  document.getElementById('stat-missions').textContent = `${gameState.missionsCompleted.length}/${MISSIONS.length}`;
  document.getElementById('stat-badges').textContent   = gameState.badgesEarned.length;
  document.getElementById('stat-accuracy').textContent = getAccuracy();

  // ── Badges grid ──
  const badgesGrid = document.getElementById('badges-grid');
  badgesGrid.innerHTML = '';
  MISSIONS.forEach(m => {
    const earned  = gameState.badgesEarned.includes(m.badge.name);
    const badgeEl = document.createElement('div');
    badgeEl.className  = `badge-item${earned ? ' earned' : ' locked'}`;
    badgeEl.setAttribute('role', 'listitem');
    badgeEl.setAttribute('aria-label',
      earned ? `${m.badge.name} badge earned` : `${m.badge.name} badge locked`
    );
    badgeEl.innerHTML = `
      <span class="badge-emoji">${earned ? m.badge.emoji : '🔒'}</span>
      <span class="badge-name">${m.badge.name}</span>
    `;
    badgesGrid.appendChild(badgeEl);
  });

  // ── Mission history ──
  const historyEl = document.getElementById('mission-history');
  historyEl.innerHTML = '';
  MISSIONS.forEach(m => {
    const attempt   = gameState.missionsAttempted[m.id];
    const completed = isMissionCompleted(m.id);

    const item = document.createElement('div');
    item.className = `history-item${completed ? ' done' : ''}`;
    item.setAttribute('role', 'listitem');

    if (attempt) {
      item.innerHTML = `
        <span class="history-icon">${completed ? '✅' : '❌'}</span>
        <div class="history-info">
          <div class="history-title">Mission ${m.id}: ${m.title}</div>
          <div class="history-detail">
            ${completed ? `Completed · ${attempt.score} pts earned` : `Attempted · ${attempt.attempts} try(s)`}
          </div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <span class="history-icon">⏳</span>
        <div class="history-info">
          <div class="history-title">Mission ${m.id}: ${m.title}</div>
          <div class="history-detail">Not yet attempted</div>
        </div>
      `;
    }
    historyEl.appendChild(item);
  });

  // ── Action buttons ──
  const playBtn  = document.getElementById('btn-analytics-play');
  const backBtn  = document.getElementById('btn-analytics-back');
  const resetBtn = document.getElementById('btn-reset-progress');

  // Clone to remove stale listeners
  [playBtn, backBtn, resetBtn].forEach(btn => {
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });

  document.getElementById('btn-analytics-play').addEventListener('click', () => {
    renderMissionSelection();
    showScreen('missions');
  });

  document.getElementById('btn-analytics-back').addEventListener('click', () => {
    initWelcomeScreen();
    showScreen('welcome');
  });

  document.getElementById('btn-reset-progress').addEventListener('click', () => {
    // Confirm before resetting
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      resetState();
      initWelcomeScreen();
      showScreen('welcome');
      announceToScreenReader('Progress has been reset');
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   12. SCREEN 7 – TIPS
   (Content is static HTML; only the back button needs wiring)
═══════════════════════════════════════════════════════════════ */

/** Wires up the tips screen back button */
function initTipsScreen() {
  const backBtn  = document.getElementById('btn-tips-back');
  const newBack  = backBtn.cloneNode(true);
  backBtn.parentNode.replaceChild(newBack, backBtn);

  newBack.addEventListener('click', () => {
    initWelcomeScreen();
    showScreen('welcome');
    setFocus('#welcome-title');
  });
}


/* ═══════════════════════════════════════════════════════════════
   13. SCREEN 8 – COMPLETION / CERTIFICATE
═══════════════════════════════════════════════════════════════ */

/** Renders and shows the completion certificate screen */
function showCompletionScreen() {
  // Fill in certificate details
  document.getElementById('cert-name').textContent  = 'Cyber Hero'; // Could ask for name
  document.getElementById('cert-score').textContent = gameState.score;
  document.getElementById('cert-date').textContent  = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Show all earned badges
  const badgesEl = document.getElementById('complete-badges');
  badgesEl.innerHTML = '';
  MISSIONS.forEach(m => {
    const badge = document.createElement('div');
    badge.className = 'complete-badge';
    badge.setAttribute('role', 'listitem');
    badge.setAttribute('aria-label', `${m.badge.name} badge`);
    badge.innerHTML = `${m.badge.emoji} ${m.badge.name}`;
    badgesEl.appendChild(badge);
  });

  // Wire buttons
  const playAgainBtn   = document.getElementById('btn-play-again');
  const viewProgressBtn = document.getElementById('btn-view-progress');

  const newPlay     = playAgainBtn.cloneNode(true);
  const newProgress = viewProgressBtn.cloneNode(true);
  playAgainBtn.parentNode.replaceChild(newPlay, playAgainBtn);
  viewProgressBtn.parentNode.replaceChild(newProgress, viewProgressBtn);

  newPlay.addEventListener('click', () => {
    resetState();
    loadState();
    initWelcomeScreen();
    showScreen('welcome');
  });

  newProgress.addEventListener('click', () => {
    renderAnalyticsScreen();
    showScreen('analytics');
  });

  // Show the screen
  showScreen('complete');
  setFocus('#complete-title');
  announceToScreenReader('Congratulations! You completed all missions and earned a certificate!');

  // Start confetti!
  setTimeout(startConfetti, 400);
}


/* ═══════════════════════════════════════════════════════════════
   14. ACHIEVEMENT POPUP
═══════════════════════════════════════════════════════════════ */

/**
 * Shows the badge-earned achievement popup
 * @param {{ emoji: string, name: string }} badge
 */
function showAchievementPopup(badge) {
  const popup    = document.getElementById('achievement-popup');
  const emojiEl  = document.getElementById('achievement-emoji');
  const titleEl  = document.getElementById('achievement-title');
  const descEl   = document.getElementById('achievement-desc');
  const closeBtn = document.getElementById('achievement-close');

  emojiEl.textContent = badge.emoji;
  titleEl.textContent = '🏅 Badge Earned!';
  descEl.textContent  = `You earned the "${badge.name}" badge! Amazing work, Cyber Hero!`;

  popup.classList.remove('hidden');
  popup.setAttribute('aria-hidden', 'false');

  // Trap focus in popup
  closeBtn.focus();

  // Announce to screen reader
  announceToScreenReader(`Badge earned: ${badge.name}! ${descEl.textContent}`);

  // Close button handler
  const newClose = closeBtn.cloneNode(true);
  closeBtn.parentNode.replaceChild(newClose, closeBtn);
  newClose.addEventListener('click', closeAchievementPopup);

  // Also close with Escape key
  popup.addEventListener('keydown', handlePopupKeydown);
}

/** Closes the achievement popup */
function closeAchievementPopup() {
  const popup = document.getElementById('achievement-popup');
  popup.classList.add('hidden');
  popup.setAttribute('aria-hidden', 'true');
  popup.removeEventListener('keydown', handlePopupKeydown);
}

/**
 * Keyboard handler for achievement popup (Escape closes it)
 * @param {KeyboardEvent} e
 */
function handlePopupKeydown(e) {
  if (e.key === 'Escape') {
    closeAchievementPopup();
  }
}


/* ═══════════════════════════════════════════════════════════════
   15. CONFETTI ENGINE
   Simple canvas-based confetti for the completion screen
═══════════════════════════════════════════════════════════════ */

/** Holds confetti particle data */
let confettiParticles = [];

/** Animation frame handle */
let confettiAnimId = null;

/**
 * Starts the confetti animation on the completion screen canvas
 */
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const card = canvas.parentElement;

  // Size canvas to match its parent card
  canvas.width  = card.offsetWidth;
  canvas.height = card.offsetHeight;

  // Cancel any running animation
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

  // Palette of cheerful colours
  const colours = ['#4DA6FF', '#4CD964', '#FFE066', '#FFB347', '#FF6B6B', '#b39ddb', '#FFFFFF'];

  // Create particles
  confettiParticles = [];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,  // start above
      w:    Math.random() * 12 + 6,    // width of piece
      h:    Math.random() * 6 + 4,     // height of piece
      r:    Math.random() * Math.PI * 2, // rotation
      dr:   (Math.random() - 0.5) * 0.2, // rotation speed
      dx:   (Math.random() - 0.5) * 2,   // horizontal drift
      dy:   Math.random() * 3 + 2,       // fall speed
      colour: colours[Math.floor(Math.random() * colours.length)],
      opacity: Math.random() * 0.5 + 0.5
    });
  }

  // Animation loop
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r);
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      // Update position
      p.x += p.dx;
      p.y += p.dy;
      p.r += p.dr;

      // Reset when falls off screen
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });

    confettiAnimId = requestAnimationFrame(drawFrame);
  }

  drawFrame();

  // Stop confetti after 6 seconds to save resources
  setTimeout(() => {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 6000);
}


/* ═══════════════════════════════════════════════════════════════
   16. KEYBOARD NAVIGATION
   Global keyboard shortcuts for accessibility
═══════════════════════════════════════════════════════════════ */

/** Sets up global keyboard shortcuts */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape from any gameplay screen back to missions
    if (e.key === 'Escape') {
      const gameScreen = document.getElementById('screen-game');
      if (gameScreen && gameScreen.classList.contains('active')) {
        renderMissionSelection();
        showScreen('missions');
      }
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   17. INITIALISATION
   Entry point – called when DOM is ready
═══════════════════════════════════════════════════════════════ */

/**
 * Main initialisation function
 * Runs once when the page loads
 */
function init() {
  // 1. Load any saved progress from localStorage
  loadState();

  // 2. Set up the welcome screen
  initWelcomeScreen();

  // 3. Pre-wire the tips back button (static screen)
  initTipsScreen();

  // 4. Set up global keyboard shortcuts
  initKeyboardShortcuts();

  // 5. Show the welcome screen
  showScreen('welcome');

  // 6. Log welcome message to console (helpful for developers)
  console.log(
    '%c🛡️ Cyber Shield – Educational Phishing Game\n' +
    '%cDeveloped for children aged 10–12.\n' +
    'All data stored locally. No external servers.',
    'color: #4DA6FF; font-size: 16px; font-weight: bold;',
    'color: #546e7a; font-size: 12px;'
  );
}

// ── Wait for the DOM to be fully loaded then run init ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already ready (e.g. script at end of body)
  init();
}
