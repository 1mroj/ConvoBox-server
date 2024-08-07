const TemplateUtilty = {};
const languages = {
  Afrikaans: "af",
  Albanian: "sq",
  Arabic: "ar",
  Azerbaijani: "az",
  Bengali: "bn",
  Bulgarian: "bg",
  Catalan: "ca",
  "Chinese (CHN)": "zh_CN",
  "Chinese (HKG)": "zh_HK",
  "Chinese (TAI)": "zh_TW",
  Croatian: "hr",
  Czech: "cs",
  Danish: "da",
  Dutch: "nl",
  English: "en",
  "English (UK)": "en_GB",
  "English (US)": "en_US",
  Estonian: "et",
  Filipino: "fil",
  Finnish: "fi",
  French: "fr",
  Georgian: "ka",
  German: "de",
  Greek: "el",
  Gujarati: "gu",
  Hausa: "ha",
  Hebrew: "he",
  Hindi: "hi",
  Hungarian: "hu",
  Indonesian: "id",
  Irish: "ga",
  Italian: "it",
  Japanese: "ja",
  Kannada: "kn",
  Kazakh: "kk",
  Kinyarwanda: "rw_RW",
  Korean: "ko",
  "Kyrgyz (Kyrgyzstan)": "ky_KG",
  Lao: "lo",
  Latvian: "lv",
  Lithuanian: "lt",
  Macedonian: "mk",
  Malay: "ms",
  Malayalam: "ml",
  Marathi: "mr",
  Norwegian: "nb",
  Persian: "fa",
  Polish: "pl",
  "Portuguese (BR)": "pt_BR",
  "Portuguese (POR)": "pt_PT",
  Punjabi: "pa",
  Romanian: "ro",
  Russian: "ru",
  Serbian: "sr",
  Slovak: "sk",
  Slovenian: "sl",
  Spanish: "es",
  "Spanish (ARG)": "es_AR",
  "Spanish (SPA)": "es_ES",
  "Spanish (MEX)": "es_MX",
  Swahili: "sw",
  Swedish: "sv",
  Tamil: "ta",
  Telugu: "te",
  Thai: "th",
  Turkish: "tr",
  Ukrainian: "uk",
  Urdu: "ur",
  Uzbek: "uz",
  Vietnamese: "vi",
  Zulu: "zu",
};

const capitalizeFirstLetter = (string) => {
  if (typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
TemplateUtilty.getlanguageCode = (language) => {
  console.log(language);
  const code = languages[capitalizeFirstLetter(language)];
  console.log(code);
  return code;
};

TemplateUtilty.templateBody = (templainfo, messageinfo) => {
  try {
    const body = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: messageinfo?.reciver,
      type: "template",
      template: {},
      components: [],
    };

    if (templainfo !== null) {
      (body.template.name = templainfo?.name),
        (body.template.language = {
          code: templainfo?.language,
        });

      if (templainfo?.header) {
        let component = {
          type: "header",
          parameters: [],
        };

        if (
          templainfo?.header_format === "IMAGE" &&
          messageinfo?.isheader &&
          messageinfo?.header?.type === "IMAGE"
        ) {
          component?.parameters?.push({
            type: "image",
            image: {
              link: messageinfo?.header?.imagelink,
            },
          });
        }
        body?.components?.push(component);

        // console.log("this is teplate has the headers");
      }

      if (templainfo?.bodyVariable !== null && templainfo?.body) {
        let component = { type: "body", parameters: [] };

        for (const item of templainfo?.bodyVariable[0]) {
          component?.parameters?.push({
            type: "text",
            text: item,
          });
        }
        // console.log("Body  components ", component);
        body?.components?.push(component);
      }
    }
    return body;
    // console.log(templainfo);
    // console.log(userVariable);
  } catch (error) {
    console.log(error);
  }
};

export default TemplateUtilty;
