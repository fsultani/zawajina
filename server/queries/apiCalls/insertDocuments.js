require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

const languages = [
  {
    name: 'Abkhaz'
  },
  {
    name: 'Adyghe'
  },
  {
    name: 'Afrikaans'
  },
  {
    name: 'Akan'
  },
  {
    name: 'Albanian'
  },
  {
    name: 'American Sign Language'
  },
  {
    name: 'Amharic'
  },
  {
    name: 'Arabic'
  },
  {
    name: 'Aragonese'
  },
  {
    name: 'Aramaic'
  },
  {
    name: 'Armenian'
  },
  {
    name: 'Assamese'
  },
  {
    name: 'Aymara'
  },
  {
    name: 'Azerbaijani'
  },
  {
    name: 'Balinese'
  },
  {
    name: 'Basque'
  },
  {
    name: 'Betawi'
  },
  {
    name: 'Bosnian'
  },
  {
    name: 'Breton'
  },
  {
    name: 'Bulgarian'
  },
  {
    name: 'Cantonese'
  },
  {
    name: 'Catalan'
  },
  {
    name: 'Cherokee'
  },
  {
    name: 'Chickasaw'
  },
  {
    name: 'Chinese'
  },
  {
    name: 'Coptic'
  },
  {
    name: 'Cornish'
  },
  {
    name: 'Corsican'
  },
  {
    name: 'Crimean Tatar'
  },
  {
    name: 'Croatian'
  },
  {
    name: 'Czech'
  },
  {
    name: 'Danish'
  },
  {
    name: 'Dari'
  },
  {
    name: 'Dutch'
  },
  {
    name: 'Dawro'
  },
  {
    name: 'English'
  },
  {
    name: 'Esperanto'
  },
  {
    name: 'Estonian'
  },
  {
    name: 'Ewe'
  },
  {
    name: 'Farsi'
  },
  {
    name: 'Fiji Hindi'
  },
  {
    name: 'Filipino'
  },
  {
    name: 'Finnish'
  },
  {
    name: 'French'
  },
  {
    name: 'Galician'
  },
  {
    name: 'Georgian'
  },
  {
    name: 'German'
  },
  {
    name: 'Greek'
  },
  {
    name: 'Greenlandic'
  },
  {
    name: 'Haitian Creole'
  },
  {
    name: 'Hawaiian'
  },
  {
    name: 'Hebrew'
  },
  {
    name: 'Hindi'
  },
  {
    name: 'Hungarian'
  },
  {
    name: 'Icelandic'
  },
  {
    name: 'Indonesian'
  },
  {
    name: 'Inuktitut'
  },
  {
    name: 'Interlingua'
  },
  {
    name: 'Irish'
  },
  {
    name: 'Italian'
  },
  {
    name: 'Japanese'
  },
  {
    name: 'Javanese'
  },
  {
    name: 'Kabardian'
  },
  {
    name: 'Kalasha'
  },
  {
    name: 'Kannada'
  },
  {
    name: 'Kashubian'
  },
  {
    name: 'Khmer'
  },
  {
    name: 'Kinyarwanda'
  },
  {
    name: 'Korean'
  },
  {
    name: 'Kurdish/Kurdî'
  },
  {
    name: 'Ladin'
  },
  {
    name: 'Latgalian'
  },
  {
    name: 'Latin'
  },
  {
    name: 'Lingala'
  },
  {
    name: 'Livonian'
  },
  {
    name: 'Lojban'
  },
  {
    name: 'Lower Sorbian'
  },
  {
    name: 'Low German'
  },
  {
    name: 'Macedonian'
  },
  {
    name: 'Malay'
  },
  {
    name: 'Malayalam'
  },
  {
    name: 'Mandarin'
  },
  {
    name: 'Manx'
  },
  {
    name: 'Maori'
  },
  {
    name: 'Mauritian Creole'
  },
  {
    name: 'Min Nan'
  },
  {
    name: 'Mongolian'
  },
  {
    name: 'Norwegian'
  },
  {
    name: 'Oriya'
  },
  {
    name: 'Pangasinan'
  },
  {
    name: 'Papiamentu'
  },
  {
    name: 'Pashto'
  },
  {
    name: 'Persian'
  },
  {
    name: 'Pitjantjatjara'
  },
  {
    name: 'Polish'
  },
  {
    name: 'Portuguese'
  },
  {
    name: 'Proto-Slavic'
  },
  {
    name: 'Punjabi'
  },
  {
    name: 'Quenya'
  },
  {
    name: 'Rajasthani'
  },
  {
    name: 'Rapa Nui'
  },
  {
    name: 'Romanian'
  },
  {
    name: 'Russian'
  },
  {
    name: 'Sanskrit'
  },
  {
    name: 'Scots'
  },
  {
    name: 'Scottish Gaelic'
  },
  {
    name: 'Semai'
  },
  {
    name: 'Serbian'
  },
  {
    name: 'Serbo-Croatian'
  },
  {
    name: 'Slovak'
  },
  {
    name: 'Slovene'
  },
  {
    name: 'Spanish'
  },
  {
    name: 'Sinhalese'
  },
  {
    name: 'Swahili'
  },
  {
    name: 'Swedish'
  },
  {
    name: 'Tagalog'
  },
  {
    name: 'Tajik'
  },
  {
    name: 'Tamil'
  },
  {
    name: 'Tarantino'
  },
  {
    name: 'Telugu'
  },
  {
    name: 'Thai'
  },
  {
    name: 'Tok Pisin'
  },
  {
    name: 'Turkish'
  },
  {
    name: 'Twi'
  },
  {
    name: 'Ukrainian'
  },
  {
    name: 'Upper Sorbian'
  },
  {
    name: 'Urdu'
  },
  {
    name: 'Uyghur'
  },
  {
    name: 'Uzbek'
  },
  {
    name: 'Venetian'
  },
  {
    name: 'Vietnamese'
  },
  {
    name: 'Vilamovian'
  },
  {
    name: 'Volapük'
  },
  {
    name: 'Võro'
  },
  {
    name: 'Welsh'
  },
  {
    name: 'Xhosa'
  },
  {
    name: 'Yiddish'
  },
  {
    name: 'Zazaki'
  },
  {
    name: 'Zulu'
  },
];

async function run() {
  try {
    await client.connect();

    const database = client.db('my-match-dev');
    const locations = database.collection('locations');

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };

    const result = await locations.insertMany(languages, options);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
