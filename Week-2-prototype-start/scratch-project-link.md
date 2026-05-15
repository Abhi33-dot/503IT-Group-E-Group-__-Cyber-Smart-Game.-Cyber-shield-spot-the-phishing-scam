[INDEX FINAL DAYB 1.HTML](https://github.com/user-attachments/files/27805032/INDEX.FINAL.DAYB.1.HTML)
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cyber Shield Prototype</title>
    <style>
        body { font-family: sans-serif; background: #eef2f3; display: flex; justify-content: center; padding-top: 50px; }
        #game-box { background: white; width: 450px; padding: 25px; border-radius: 12px; border: 3px solid #1a5f7a; text-align: center; box-shadow: 5px 5px 15px rgba(0,0,0,0.1); }
        .hidden { display: none; }
        .email-preview { background: #f9f9f9; border: 1px solid #ccc; text-align: left; padding: 10px; margin: 15px 0; font-size: 0.9em; }
        button { background: #1a5f7a; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #2488b0; }
        .reward { color: #f39c12; font-size: 1.5em; font-weight: bold; }
    </style>
</head>
<body>

<div id="game-box">
    <div id="screen-welcome">
        <h1>🛡️ Cyber Shield</h1>
        <p><strong>Instructions:</strong> Your mission is to identify phishing scams. Look at the message and choose the safest action to protect your data!</p>
        <button onclick="showScreen('screen-challenge')">START MISSION</button>
    </div>

    <div id="screen-challenge" class="hidden">
        <h3>Challenge #1: The Bank Alert</h3>
        <div class="email-preview">
            <strong>From:</strong> security@bank-check-verify.com<br>
            <strong>Subject:</strong> Urgent: Unusual Activity!<br><hr>
            We noticed a login from a new device. Click here to secure your account: 
            <a href="#">http://bit.ly/secure-login-302</a>
        </div>
        <p>What is the safest option?</p>
        <button onclick="showFeedback(false)">Click the link to check</button>
        <button onclick="showFeedback(true)">Report and Delete email</button>
    </div>

    <div id="screen-feedback" class="hidden">
        <h2 id="feedback-title"></h2>
        <p id="feedback-text"></p>
        <div id="reward-area" class="hidden">
            <p class="reward">🏆 +100 Points!</p>
            <p>You earned the <strong>Junior Shield Badge!</strong></p>
        </div>
        <button onclick="location.reload()">Play Again</button>
    </div>
</div>

<script>
    function showScreen(screenId) {
        // Hide all screens
        document.getElementById('screen-welcome').classList.add('hidden');
        document.getElementById('screen-challenge').classList.add('hidden');
        document.getElementById('screen-feedback').classList.add('hidden');
        
        // Show the requested one
        document.getElementById(screenId).classList.remove('hidden');
    }

    function showFeedback(isCorrect) {
        const title = document.getElementById('feedback-title');
        const text = document.getElementById('feedback-text');
        const reward = document.getElementById('reward-area');

        if (isCorrect) {
            title.innerText = "✅ Correct!";
            text.innerText = "Well done! You spotted the suspicious sender address and the shortened link.";
            reward.classList.remove('hidden'); // Show reward/score
        } else {
            title.innerText = "❌ Incorrect";
            text.innerText = "That was a trick! Real banks won't use shortened bit.ly links for security.";
            reward.classList.add('hidden');
        }
        showScreen('screen-feedback');
    }
</script>

</body>
</html>
<style>
    :root {
        --primary-blue: #1a5f7a;
        --accent-yellow: #f1c40f;
        --bg-color: #d1d8e0;
        --success-green: #27ae60;
    }

    body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        background: var(--bg-color); 
        display: flex; 
        justify-content: center; 
        align-items: center;
        height: 100vh;
        margin: 0; 
    }

    #game-box { 
        background: white; 
        width: 480px; 
        padding: 40px; 
        border-radius: 25px; 
        border: 6px solid var(--primary-blue); 
        text-align: center; 
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        position: relative;
    }

    h1 { color: var(--primary-blue); font-size: 2.2em; margin-bottom: 10px; }

    /* The Character Placeholder */
    .character-icon {
        font-size: 50px;
        background: #e8f4f8;
        width: 80px;
        height: 80px;
        line-height: 80px;
        border-radius: 50%;
        margin: 0 auto 20px;
        border: 3px solid var(--primary-blue);
    }

    .email-preview { 
        background: #fdfdfd; 
        border: 2px dashed #cbd5e0; 
        text-align: left; 
        padding: 20px; 
        margin: 20px 0; 
        border-radius: 12px;
        font-family: monospace;
    }

    button { 
        background: var(--primary-blue); 
        color: white; 
        border: none; 
        padding: 15px 30px; 
        border-radius: 50px; 
        cursor: pointer; 
        margin: 10px; 
        font-weight: bold;
        font-size: 1rem;
        transition: transform 0.2s, background 0.2s;
        width: 80%;
    }

    button:hover { 
        background: #2488b0; 
        transform: scale(1.05);
    }

    .reward { 
        color: var(--accent-yellow); 
        font-size: 2em; 
        text-shadow: 2px 2px #333;
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .hidden { display: none; }
</style>
<div class="character-icon">👦</div>
<div class="character-icon">🛡️</div>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyber Shield | Professional Prototype</title>
    <style>
        /* CSS VARIABLES FOR EASY EDITING */
        :root {
            --primary: #007bff;
            --dark: #0f172a;
            --light: #f8fafc;
            --success: #22c55e;
            --danger: #ef4444;
            --gold: #fbbf24;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: radial-gradient(circle at top right, #1e293b, #0f172a);
            color: var(--light);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* GLASSMORPHISM CONTAINER */
        #game-container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 90%;
            max-width: 500px;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
        }

        .screen { transition: all 0.3s ease; }
        .hidden { display: none; }

        /* CHARACTER BOX */
        .character-slot {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, var(--primary), #3b82f6);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            border: 4px solid rgba(255,255,255,0.2);
            box-shadow: 0 0 20px rgba(0, 123, 255, 0.4);
        }

        h1 { font-size: 2rem; letter-spacing: -1px; margin-bottom: 8px; color: white; }
        p { color: #94a3b8; line-height: 1.6; }

        /* THE SCENARIO CARD */
        .scenario-card {
            background: #1e293b;
            border-radius: 16px;
            padding: 20px;
            text-align: left;
            border-left: 4px solid var(--primary);
            margin: 25px 0;
        }

        .email-header { font-size: 0.8rem; color: #64748b; margin-bottom: 10px; }
        .email-body { color: #e2e8f0; font-family: 'Courier New', Courier, monospace; }

        /* PREMIUM BUTTONS */
        button {
            display: block;
            width: 100%;
            padding: 16px;
            margin: 12px 0;
            border-radius: 12px;
            border: none;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: #2563eb; transform: translateY(-2px); }

        .btn-outline { background: transparent; border: 2px solid #334155; color: #94a3b8; }
        .btn-outline:hover { border-color: var(--primary); color: white; }

        /* REWARD ANIMATION */
        .badge {
            font-size: 3rem;
            margin-bottom: 10px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    </style>
</head>
<body>

<div id="game-container">
    <div id="screen-welcome" class="screen">
        <div class="character-slot">🛡️</div>
        <h1>CYBER SHIELD</h1>
        <p>Master the art of spotting scams. Your mission starts now, Agent.</p>
        <button class="btn-primary" onclick="showScreen('screen-challenge')">START MISSION</button>
    </div>

    <div id="screen-challenge" class="screen hidden">
        <h2 style="color: var(--primary)">Mission 01</h2>
        <div class="scenario-card">
            <div class="email-header">
