const fs = require("fs");

module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "nx nayem",
  description: "Send funny message when someone leaves or gets removed"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData, author } = event;
  const leftUserID = logMessageData.leftParticipantFbId;

  // নিজে নিজেই বের হলে author === user
  const isKicked = author !== leftUserID;

  // ইউজারের নাম
  const userInfo = await api.getUserInfo(leftUserID);
  const userName = userInfo[leftUserID]?.name || "Someone";

  // রিমুভ করলে কার দ্বারা
  let removedByName = "";
  if (isKicked) {
    const authorInfo = await api.getUserInfo(author);
    removedByName = authorInfo[author]?.name || "Someone";
  }

  // ফানি লাইনগুলো
  const funnyLines = [
    `😢 ${userName} চলে গেলো...\nতোমার চলে যাওয়ায় আমাদের চায়ের খরচ কমবে ☕😂`,
    `🚪 ${userName} পালিয়ে গেছে...\nবোধহয় !rules দেখে ভয় পেয়ে গেছে!`,
    `📤 ${userName} লিভ নিলো...\nএত ভালো গ্রুপ সবাই নিতে পারে না 😎`,
    `😂 ${userName} বের হয়ে গেছে...\nমেম্বার কাউন্ট এখন আবার বেজোড়!`,
    `🤷 ${userName} চলে গেল...\nআচ্ছা, সে কি শুধু মেম্বার ছিল নাকি স্পাইও ছিল? 👀`,
    `😈 ${userName} রিমুভ হইছে by ${removedByName}...\nকারেন্ট একটু বেশি লাগছে মনে হয় 🔥`
  ];

  // মেসেজ তৈরি
  const message = isKicked
    ? funnyLines[funnyLines.length - 1] // রিমুভ হলে শেষ লাইন
    : funnyLines[Math.floor(Math.random() * (funnyLines.length - 1))];

  // মেসেজ পাঠানো
  return api.sendMessage(message, threadID);
};
