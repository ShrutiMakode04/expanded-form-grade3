import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice voice

const lines = [
  "Welcome to Expanded and Standard Form! Ready to stretch out some numbers? Let's go!",
  "How do we show what a really big number is made of? Like all the thousands, hundreds, tens, and ones hiding inside it? Is the number 4523 just a 4, a 5, a 2, and a 3 pushed together?",
  
  "Treasure Chest Builder. Pick ONLY the coin bags that make 4,582. Click the correct ones!",
  "Robot Energy Pack. Listen to the robot and type the full number on the numpad.",
  "Place Value Lab. Match each number part to its correct place value label!",
  "Space Fuel Station. Which fuel tank is missing to make the rocket reach 8,706?",
  "Expanded Form Puzzle. Click the chips in order to complete the equation!",
  "Zoo Animal Counter. The hundreds counter is broken! What is the hundreds digit of 4,925?",
  "Digit Value Decoder. Select a value chip, then drop it in the correct color zone!",
  "Train Compartment Assembly. Each compartment holds one digit. What number does the train make?",
  "Zero Hero Challenge. Careful! 5,040 has a zero. Pick ONLY the correct parts, no zero bags!",
  "Number Balance Scale. Click the HEAVIER pan, it holds the BIGGER number!",
  "Math Wizard Spell. Add all the parts and type the standard form answer!",
  "Jungle Code Decoder. Which expanded form is the correct code for 3,815?",
  "Digit Spotlight. Look at the glowing digit. Type its PLACE VALUE using the numpad!",
  "Pirate Treasure Decode. The tens digit is hidden on the treasure map! What is it?",
  "Number Fusion Machine. Click orbs from LARGEST to SMALLEST! They will fuse into a number.",

  "Welcome to the Magic Number Classroom! Today we'll discover how big numbers are built.",
  "Look at the number 4,523. It starts with 4 THOUSANDS! These are the biggest, heaviest blocks.",
  "Next, we have 5 HUNDREDS! These are flat, shiny squares stacked together.",
  "Then come 2 TENS and 3 ONES. Even the smallest pieces are very important!",
  "When we stretch the number out to see all its parts, we call it EXPANDED FORM!",
  "And when we squish all the parts back together into one number, it's STANDARD FORM!",
  
  "Welcome to the Practice Phase! Choose a level to begin.",
  "Level Complete! You earned three stars!",
  "Awesome job! Plus ten XP!",
  "Nice try!",
  "Oops! Try again!",
  "Welcome to Number Pizza Chef!",
  "Welcome to Monster Number Builder!",
  "Welcome to Castle Brick Builder!",
  "Welcome to Ultimate Challenge!"
];

const outputDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAudio(text) {
  const hash = crypto.createHash('md5').update(text).digest('hex');
  const filePath = path.join(outputDir, `${hash}.mp3`);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping (already exists): ${text.substring(0, 30)}...`);
    return;
  }

  console.log(`Generating: ${text.substring(0, 30)}...`);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(`Failed to generate: ${err}`);
      return;
    }

    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved: ${hash}.mp3`);
    
    await new Promise(r => setTimeout(r, 1000));
  } catch (error) {
    console.error(`Error:`, error);
  }
}

async function run() {
  if (!API_KEY) {
    console.error("Missing VITE_ELEVENLABS_API_KEY in .env");
    return;
  }
  for (const line of lines) {
    await generateAudio(line);
  }
  console.log("Done!");
}

run();
