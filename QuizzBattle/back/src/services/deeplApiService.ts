import axios from "axios";
import qs from "qs";

async function translate(text) {
  const data = qs.stringify({
    text: text,
    target_lang: "FR",
    source_lang: "EN",
  });
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      data,
      {
        headers: {
          Authorization: `DeepL-Auth-Key 120c8dbd-02da-9423-b4ad-85b72d55bcd6:fx`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    return response.data.translations[0].text;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("An error occurred while translating text.");
  }
}

module.exports = {
  translate,
};
