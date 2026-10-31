// Sends a Telegram message to the shop owner when a customer books.
// BOT_TOKEN and CHAT_ID are set in Netlify > Site settings > Environment variables.
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  var token = process.env.BOT_TOKEN, chat = process.env.CHAT_ID;
  if (!token || !chat) return { statusCode: 500, body: "Not configured" };
  var d;
  try { d = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, body: "Bad request" }; }
  function c(v, n) { return String(v || "").slice(0, n); }
  var text = "🔔 ការកក់ថ្មី " + c(d.id, 20) +
    "\nសេវា៖ " + c(d.svc, 60) +
    "\nឈ្មោះ៖ " + c(d.name, 80) +
    "\nទូរស័ព្ទ៖ " + c(d.phone, 20) +
    "\nតំបន់៖ " + c(d.area, 60) +
    (d.addr ? "\nអាសយដ្ឋាន៖ " + c(d.addr, 300) : "") +
    (d.when ? "\nពេល៖ " + c(d.when, 30).replace("T", " ") : "") +
    (d.note ? "\nបញ្ហា៖ " + c(d.note, 500) : "");
  var r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: text })
  });
  return { statusCode: r.ok ? 200 : 502, body: r.ok ? "ok" : "Telegram error" };
};
