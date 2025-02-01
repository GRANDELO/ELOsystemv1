const express = require('express');
const router = express.Router();


const townsAndAreas1 = [
  { region: 'Nairobi', County: 'Nairobi', town: 'Rongai', areas: ['Bomas', 'Maasai Lodge', 'Tumaini', 'Kware', 'Rimpa', 'Gataka', 'Mericho', 'Acacia Estate', 'Laiser Hill' ]},
  { region: 'Central', County: 'Kiambu', town: 'Thika Road', areas: ['Allsops', 'Kahawa West', 'Kahawa Sukari', 'Kahawa Wendani', 'Roysambu', 'Zimmerman', 'Juja', 'Ruiru', 'Githurai', 'Witeithie' ]},
  { region: 'Central', County: 'Kiambu', town: 'Thika', areas: ['Ngoingwa', 'Makongeni', 'Juja', 'Gatundu', 'Kiganjo', 'Muguga', 'Kenyatta Road', 'Kiboko', 'Kisii', 'Landless', 'Section 9', 'Section 2', 'Kamenu', 'Pilot Estate', 'Kilimambogo', 'Munene Estate', 'Central Business District' ] },
  { region: 'Nairobi', County: 'Nairobi', town: 'Nairobi', areas: ['Westlands', 'Kilimani', 'Kasarani', 'Karen', 'Langata', 'Roysambu', 'Eastleigh', 'Embakasi', 'Lavington', 'Ngong Road', 'Kayole', 'Dandora', 'Dagoretti', 'Pumwani', 'Pangani', 'Donholm', 'Umoja', 'Komarock', 'Buru-Buru', 'Makadara', 'Industrial Area', 'KCA Area', 'Ngara', 'Allsops', 'Pipeline', 'Huruma', 'Parklands', 'Runda', 'Gigiri', 'Muthaiga', 'Thome', 'Roysambu', 'Zimmerman', 'Githurai', 'South B', 'South C', 'Imara Daima', 'Syokimau', 'Mlolongo', 'Kileleshwa', 'Lavington', 'Riverside', 'Spring Valley', 'Kyuna'] },
  { region: 'Coast', County: 'Mombasa', town: 'Mombasa', areas: ['Nyali', 'Bamburi', 'Mvita', 'Likoni', 'Changamwe', 'Kisauni', 'Shanzu', 'Mtwapa', 'Tudor', 'Port Reitz',  "Jomvu",] },
  { region: 'Central', County: 'Muranga', town: 'Muranga', areas: ['Delview', 'Kabati','kenol', 'Sabasaba', 'Maragua', 'Muranga Town', 'Mukuyu', 'Makuyu', 'Kandara' ]},
  { region: 'Western', County: 'Kisumu', town: 'Kisumu', areas: ['Milimani', 'Ahero ', 'Nyalenda', 'Manyatta', 'Mamboleo', 'Lolwe', 'Tom Mboya', 'Obunga', 'Dunga', 'Kibos', 'Ojolla'] },
  { region: 'Rift Valley', County: 'Nakuru', town: 'Nakuru', areas: ['Milimani', 'Langalanga', 'Shabab', 'Kiti', 'Free Area', 'Naka', 'Mwariki', 'Lanet', 'Rhonda', 'Bondeni'] },
  { region: 'Rift Valley', County: 'Eldoret', town: 'Eldoret', areas: ['Langas', 'Kapsoya', 'Munyaka', 'Elgon View', 'Huruma', 'Kimumu', 'Pioneer', 'Sosiani', 'Kipkaren', 'Racecourse'] },
  { region: 'Central', County: 'Nyeri', town: 'Nyeri', areas: ['Karatina', 'Othaya', 'Nyeri Town', 'Kieni', 'Naro Moru', 'chaka', 'Kamakwa', 'Mukurwe-ini', 'Mathira', 'Ruringu', 'Kamakwa', 'Kangemi', 'King\'ong\'o', 'Gatitu', 'Kiganjo', 'Skuta', 'Ragati', 'Ngangarithi', 'Majengo'] },
  { region: 'Eastern', County: 'Machakos', town: 'Machakos', areas: ['Machakos town', 'Mua Hills', 'Katoloni', 'Kangundo', 'Mlolongo', 'Athi River', 'Wamunyu', 'Kyumbi', 'Kaseve', 'Masinga', 'Kithimani'] },
  { region: 'Eastern',County: 'Meru', town: 'Meru', areas: ['Makutano', 'Gakoromone', 'Kaaga', 'Kinoru', 'Kithoka', 'Mitunguu', 'Nkubu', 'Timau', 'Chogoria', 'Kionyo'] },
  { region: 'Western', County: 'Kakamenga', town: 'Kakamega', areas: ['Lurambi', 'Shinyalu', 'Navakholo', 'Butere', 'Mumias', 'Ilesi', 'Khayega', 'Malava', 'Ikolomani', 'Likuyani'] },
  { region: 'Central',County: 'Embu', town: 'Embu', areas: ['Blue Valley', 'Kirimari', 'Dallas', 'Itabua', 'Njukiri', 'Kianjokoma', 'Kairuri', 'Runyenjes', 'Siakago', 'Karurumo'] },
  { region: 'North Eastern', County: 'Garissa', town: 'Garissa', areas: ['Bura', 'Dadaab', 'Modogashe', 'Hulugho', 'Iftin', 'Korakora', 'Sankuri', 'Mbalambala', 'Burtile', 'Nanighi'] },
  { region: 'Rift Valley',County: 'Kericho', town: 'Kericho', areas: ['Kericho Town', 'Kapsoit', 'Litein', 'Chepseon', 'Brooke', 'Roret', 'Kipkelion', 'Sigowet', 'Kabianga', 'Sosiot'] },
  { region: 'Rift Valley',County: 'Trans-zoia', town: 'Kitale', areas: ['Milimani', 'Tuwani', 'Matisi', 'Kipsongo', 'Bikeke', 'Makutano', 'Bidii', 'Kwanza', 'Saboti', 'Sikhendu'] },
  { region: 'Coast', County: 'Malindi',  town: 'Malindi', areas: ['Watamu', 'Ganda', 'Gede', 'Shela', 'Langobaya', 'Marafa', 'Mambrui', 'Sabaki', 'Kakuyuni', 'Kijiwetanga'] },
  { region: 'Rift Valley', County: 'Narok', town: 'Narok', areas: ['Ololulung\'a', 'Kilgoris', 'Emurua Dikirr', 'Ntulele', 'Nairagie Enkare', 'Mulot', 'Ewaso Ngiro', 'Sagamik', 'Maji Moto', 'Olchorro'] },
  { region: 'Rift Valley', County: 'Naivasha', town: 'Naivasha', areas: ['Kongoni', 'Karagita', 'Mai Mahiu', 'Kayole', 'Karati', 'Kihoto', 'Mirera', 'Maraigushu', 'Kedong', 'Kongoni'] },
  { region: 'Rift Valley', County: 'Nanyuki', town: 'Nanyuki', areas: ['Likii', 'Baraka', 'Riverside', 'Muthaiga', 'Sweetwaters', 'Tigithi', 'Nturukuma', 'Endana', 'Mugambi', 'Ngare Ndare'] },
  { region: 'Eastern', County: 'Isiolo', town: 'Isiolo', areas: ['Kambi Garba', 'Wabera', 'Bulapesa', 'Kiwanjani', 'Ngare Mara', 'Oldonyiro', 'Merti', 'Garbatulla', 'Sericho', 'Burat'] },
  { region: 'Coast', County: 'Lamu', town: 'Lamu', areas: ['Shela', 'Mokowe', 'Hindi', 'Faza', 'Matondoni', 'Kizingitini', 'Pate', 'Witu', 'Kipungani', 'Manda'] },
  { region: 'Northern', County: 'Lodwar', town: 'Lodwar', areas: ['Nakwamekwi', 'Kanamkemer', 'Kerio', 'Kalokol', 'Kakuma', 'Lokichogio', 'Lokori', 'Lokitaung', 'Lowarengak', 'Turkwel'] },
  { region: 'Western', County: 'Migori', town: 'Migori', areas: ['Awendo', 'Rongo', 'Kuria', 'Isebania', 'Macalder', 'Uriri', 'Masara', 'Suna', 'Nyatike', 'Muhuru Bay'] },
  { region: 'Rift Valley', County: 'Molo', town: 'Molo', areas: ['Elburgon', 'Turi', 'Keringet', 'Mau Summit', 'Kamara', 'Njoro', 'Total', 'Mau Narok', 'Nessuit', 'Mariashoni'] },
  { region: 'Coast', County: 'Voi', town: 'Voi', areas: ['Ikanga', 'Kasigau', 'Mzima Springs', 'Sagala', 'Ndara', 'Mbololo', 'Wundanyi', 'Bura', 'Mwatate', 'Taveta'] },
  { region: 'North Eastern', County: 'Wajir', town: 'Wajir', areas: ['Griftu', 'Eldas', 'Tarbaj', 'Habaswein', 'Bute', 'Buna', 'Khorof Harar', 'Dadajabula', 'Leheley', 'Gurar'] },
  { region: 'Eastern', County: 'Marsabit', town: 'Marsabit', areas: ['Moyale', 'Sololo', 'North Horr', 'Loiyangalani', 'Kargi', 'Laisamis', 'Korr', 'Illeret', 'Maikona', 'Dukana'] },
  { region: 'Rift Valley', County: 'Bomet', town: 'Bomet', areas: ['Kaplong', 'Sotik', 'Longisa', 'Ndanai', 'Mulot', 'Sigor', 'Chebunyo', 'Kipreres', 'Kimulot', 'Mogogosiek'] },
  { region: 'Western', County: 'Bungoma', town: 'Bungoma', areas: ['Webuye', 'Kimilili', 'Chwele', 'Bokoli', 'Lugulu', 'Naitiri', 'Kanduyi', 'Kibabii', 'Misikhu', 'Khalaba'] },
  { region: 'Western', County: 'Busia', town: 'Busia', areas: ['Nambale', 'Matayos', 'Funyula', 'Butula', 'Port Victoria', 'Samia', 'Sio Port', 'Amukura', 'Bunyala', 'Malaba'] },
  { region: 'Central', County: 'Nyeri', town: 'Chuka', areas: ['Karingani', 'Magumoni', 'Maara', 'Kaanwa', 'Karingani', 'Ithwana', 'Mitheru', 'Igambang\'ombe', 'Kamwimbi', 'Kiamwathi'] },
  { region: 'Rift Valley', County: 'Kajiado', town: 'Kajiado', areas: ['Ngong', 'Ongata Rongai', 'Kitengela', 'Isinya', 'Namanga', 'Loitokitok', 'Mashuuru', 'Sultan Hamud', 'Kimana', 'Kiserian'] },
  { region: 'Rift Valley', County: 'Turkana', town: 'Kapenguria', areas: ['Chepareria', 'Kacheliba', 'Sigor', 'Ortum', 'Kodich', 'Kapsait', 'Lelan', 'Sook', 'Alale', 'Mnagei'] },
  { region: 'Nyanza', County: 'Kisii', town: 'Kisii', areas: ['Suneka', 'Ogembo', 'Kenyenya', 'Nyamarambe', 'Kisii Town', 'Keroka', 'Keumbu', 'Nyatieko', 'Mosocho', 'Nyamache'] },
  { region: 'Coast', County: 'Kwale', town: 'Kwale', areas: ['Ukunda', 'Diani', 'Msambweni', 'Kinango', 'Lunga Lunga', 'Shimoni', 'Matuga', 'Tiwi', 'Kibuyuni', 'Magutu'] },
  { region: 'Western', County: 'Kakamenga', town: 'Malava', areas: ['Matunda', 'Lugari', 'Mukhonje', 'Kakamega', 'Matioli', 'Malava Town', 'Munduli', 'Milando', 'Shamakhokho', 'Sango'] },
  { region: 'North Eastern', County: 'Mandera', town: 'Mandera', areas: ["Banisa", "Arabia", "Lafey", "Elwak", "Mandera Town", "Fafi", "Takaba", "Bula Hawa", "Dandu", "Dolo"] },
  { region: 'Nyanza', County: 'Siaya', town: "Siaya", areas: ["Siaya Town", "Bondo", "Ugunja", "Usenge", "Yala", "Asembo", "Rarieda", "Nyadorera", "Ndori", "Sidindi", "Uholo", "Alego"] },
  { region: 'Rift Valley', County: 'Uasin Gishu', town: 'Uasin Gishu', areas: ['Eldoret Town', "Kimumu", 'Turbo', 'Moiben', 'Kesses', 'Ziwa', 'Kapseret', "Elgon View", 'Kapsoya', 'Langas', "Annex", 'Kipkabus', "Outspan", "Huruma", "Chepkoilel", "Racecourse", "Pioneer", 'Matiang\'i'] },
];

const townsAndAreas =[
  {
    "county": "Kiambu County",
    "towns": [
      {
        "town": "Thika",
        "areas": [
          "Ngoingwa",
          "Makongeni",
          "Section 9",
          "Landless",
          "Thika Town Center",
          "Industrial Area",
          "Blue Post",
          "Witeithie",
          "Majengo",
          "Athena",
          "Gatuanyaga",
          "Mangu",
          "Kamwangi",
          "Kiandutu",
          "Muthurwa",
          "Makuyu",
          "Kenol",
          "Kabati",
          "Mitubiri",
          "Mataha",
          "Ngoliba",
          "Yatta",
          "Thika Greens",
          "Thika Golden Pearl",
          "Bahati Ridge",
          "Muguga",
          "Garissa Road Area",
          "Nanyuki Road Area",
          "Murang'a Road Area",
          "Thika Sports Club Area",
          "Chania Estate",
          "Section 2",
          "Hospital Area",
          "Stadium Area"
        ]
      },
      {
        "town": "Kiambu",
        "areas": [
          "Kiambu Town Centre",
          "Kiambu Institute of Science and Technology (KIST) Area",
          "Kiambu District Hospital Area",
          "Kiambu Police Station Area",
          "Kiambu Stadium Area",
          "Ridgeways",
          "Kirigiti",
          "Karunga",
          "Ngecha",
          "Cianda"
        ]
      },
      {
        "town": "Karuri",
        "areas": [
          "Karuri Town Centre",
          "Ngenya",
          "Rironi",
          "King'eero",
          "Ndenderu",
          "Kihara",
          "Kiambaa",
          "Gachie",
          "Banana",
          "Muchatha",
          "Cianda",
          "Karura",
          "Wangige",
          "Kabete",
          "Uthiru",
          "Kangemi",
          "Redhill"
        ]
      },
      {
        "town": "Limuru",
        "areas": [
          "Limuru Town Centre",
          "Limuru Country Club Area",
          "Rironi",
          "Ngecha",
          "Tigoni",
          "Ndeiya",
          "Lari",
          "Muguga"
        ]
      },
      {
        "town": "Juja",
        "areas": [
          "Juja Town Centre",
          "Juja Farm",
          "Juja South",
          "Juja East",
          "Juja West",
          "Kalimoni",
          "Theta",
          "Mugutha",
          "Witeithie (partially)",
          "Juja Road",
          "Thika Road",
          "Juja-Kalimoni Road",
          "Juja-Theta Road",
          "Juja Industrial Park",
          "Jomo Kenyatta University of Agriculture and Technology (JKUAT) Area",
          "Juja Police Station Area",
          "Juja Shopping Centre Area",
          "Brookside City",
          "Eden City",
          "Centum City"
        ]
      },
      {
        "town": "Ruiru",
        "areas": [
          "Ruiru Town Centre",
          "Ruiru East",
          "Ruiru West",
          "Ruiru North",
          "Ruiru South",
          "Kimbo",
          "Kahawa Wendani",
          "Kahawa Sukari",
          "Membley",
          "Mwihoko",
          "Githurai 45 (partially)",
          "Kiamwangi",
          "Bypass Area",
          "Eastern Bypass Area",
          "Thika Road Area",
          "Ruiru-Kiambu Road"
        ]
      },
      {
        "town": "Kikuyu",
        "areas": [
          "Kikuyu Town Centre",
          "Kikuyu Market",
          "Kikuyu Railway Station",
          "Kikuyu Hospital",
          "Kikuyu Police Station",
          "Kikuyu High School",
          "Kikuyu CDF Area",
          "Kikuyu Constituency Office",
          "Kamangu",
          "Karai",
          "Gikambura",
          "Muguga",
          "Ndeiya",
          "Thogoto",
          "Kikuyu-Dagoretti Road",
          "Kikuyu-Karen Road",
          "Kikuyu-Limuru Road",
          "Southern Bypass Area"
        ]
      }
    ]
  },
  {
    "county": "Nyeri County",
    "towns": [
      {
        "town": "Nyeri",
        "areas": [
          "Nyeri Town Centre",
          "Nyeri National Polytechnic Area",
          "Nyeri County Headquarters Area",
          "Nyeri Provincial General Hospital Area",
          "Dedan Kimathi University of Technology (DeKUT) Area",
          "Kiganjo",
          "Ruring'u",
          "King'ong'o",
          "Skuta",
          "Ihururu",
          "Mathira",
          "Mukurweini",
          "Othaya",
          "Tetu",
          "Kieni",
          "Mweiga",
          "Chaka",
          "Endarasha"
        ]
      },
      {
        "town": "Karatina",
        "areas": [
          "Karatina Town Centre",
          "Karatina Market",
          "Karatina Bus Park",
          "Karatina Railway Station",
          "Karatina Hospital",
          "Karatina Police Station",
          "Karatina University College",
          "Kagumo",
          "Kimunyu",
          "Gakindu",
          "Iriaini"
        ]
      },
      {
        "town": "Mukurweini",
        "areas": [
          "Mukurweini Town Centre",
          "Mukurweini Market",
          "Mukurweini Hospital",
          "Mukurweini Police Station",
          "Mukurweini Boys High School",
          "Mukurweini Girls High School",
          "Githi",
          "Gitero",
          "Kihumo",
          "Kiamwangi",
          "Rware"
        ]
      },
      {
        "town": "Othaya",
        "areas": [
          "Othaya Town Centre",
          "Othaya Market",
          "Othaya Hospital",
          "Othaya Police Station",
          "Othaya Boys High School",
          "Othaya Girls High School",
          "Mahiga",
          "Kianganda",
          "Kiraini",
          "Kanyange"
        ]
      },
      {
        "town": "Tetu",
        "areas": [
          "Tetu Town",
          "Tetu Market",
          "Tetu Hospital",
          "Tetu Police Station",
          "Tetu Boys High School",
          "Tetu Girls High School",
          "Gatundu",
          "Githunguri",
          "Ithendu",
          "Kamwangi"
        ]
      },
      {
        "town": "Kieni",
        "areas": [
          "Kieni East",
          "Kieni West",
          "Kieni North",
          "Kieni South",
          "Naro Moru",
          "Sirimon",
          "Timau",
          "Chumvi",
          "Endarasha",
          "Mweiga"
        ]
      },
      {
        "town": "Mweiga",
        "areas": [
          "Mweiga Town",
          "Mweiga Market",
          "Mweiga Hospital",
          "Mweiga Police Station",
          "Mweiga Boys High School",
          "Mweiga Girls High School",
          "Nyeri National Park",
          "Aberdare National Park",
          "Kimathi University College of Agriculture and Technology"
        ]
      },
      {
        "town": "Chaka",
        "areas": [
          "Chaka Market",
          "Chaka Town",
          "Chaka Hospital",
          "Chaka Police Station",
          "Chaka Boys High School",
          "Chaka Girls High School",
          "Kieni (Partially)"
        ]
      },
      {
        "town": "Endarasha",
        "areas": [
          "Endarasha Town",
          "Endarasha Market",
          "Endarasha Hospital",
          "Endarasha Police Station",
          "Endarasha Boys High School",
          "Endarasha Girls High School",
          "Kieni (Partially)"
        ]
      },
      {
        "town": "Ihururu",
        "areas": [
          "Ihururu Town",
          "Ihururu Market",
          "Ihururu Hospital",
          "Ihururu Police Station",
          "Ihururu Boys High School",
          "Ihururu Girls High School",
          "Mathira (Partially)"
        ]
      },
      {
        "town": "Mathira",
        "areas": [
          "Mathira East",
          "Mathira West",
          "Mathira North",
          "Mathira South",
          "Karura",
          "Kiamahiga",
          "Kanyagia",
          "Kihoya",
          "Muthiga"
        ]
      }
    ]
  },
  {
    "county": "Murang'a County",
    "towns": [
      {
        "town": "Murang'a",
        "areas": [
          "Murang'a Town Centre",
          "Murang'a County Headquarters",
          "Murang'a District Hospital",
          "Murang'a University",
          "Murang'a Polytechnic",
          "Ithanga",
          "Kahuti",
          "Kangema",
          "Kanyenya-ini",
          "Kigumo",
          "Mathioya",
          "Mumbi",
          "Ngutu",
          "Rachariri",
          "Sabasaba",
          "Wempa"
        ]
      },
      {
        "town": "Kenol",
        "areas": [
          "Kenol Town Centre",
          "Kenol Market",
          "Kenol Police Station",
          "Kenol Hospital",
          "Kabati",
          "Makuyu",
          "Sagana",
          "Maragua"
        ]
      },
      {
        "town": "Maragua",
        "areas": [
          "Maragua Town Centre",
          "Maragua Market",
          "Maragua Hospital",
          "Maragua Police Station",
          "Mukuyu",
          "Kambirwa",
          "Nginda",
          "Ichagaki",
          "Kenol (partially)",
          "Sagana (partially)"
        ]
      },
      {
        "town": "Sagana",
        "areas": [
          "Sagana Town Centre",
          "Sagana Market",
          "Sagana Railway Station",
          "Sagana River",
          "Sagana University College",
          "Kabati (partially)",
          "Kenol (partially)",
          "Maragua (partially)",
          "Mukuyu (partially)"
        ]
      },
      {
        "town": "Kangema",
        "areas": [
          "Kangema Town Centre",
          "Kangema Market",
          "Kangema Hospital",
          "Kangema Police Station",
          "Kanyenya-ini (partially)",
          "Mathioya (partially)"
        ]
      },
      {
        "town": "Kanyenya-ini",
        "areas": [
          "Kanyenya-ini Town Centre",
          "Kanyenya-ini Market",
          "Kanyenya-ini Hospital",
          "Kanyenya-ini Police Station",
          "Kangema (partially)",
          "Mathioya (partially)"
        ]
      },
      {
        "town": "Mathioya",
        "areas": [
          "Mathioya Town Centre",
          "Mathioya Market",
          "Mathioya Hospital",
          "Mathioya Police Station",
          "Kangema (partially)",
          "Kanyenya-ini (partially)"
        ]
      },
      {
        "town": "Ithanga",
         "areas":[
          "Ithanga Town Centre",
          "Ithanga Market",
          "Ithanga Hospital",
          "Ithanga Police Station"
          ]
      },
          {
        "town": "Kahuti",
         "areas":[
          "Kahuti Town Centre",
          "Kahuti Market",
          "Kahuti Hospital",
          "Kahuti Police Station"
          ]
      },
          {
        "town": "Kigumo",
         "areas":[
          "Kigumo Town Centre",
          "Kigumo Market",
          "Kigumo Hospital",
          "Kigumo Police Station"
          ]
      },
          {
        "town": "Mumbi",
        "areas":[
          "Mumbi Town Centre",
          "Mumbi Market",
          "Mumbi Hospital",
          "Mumbi Police Station"
          ]
      },
          {
        "town": "Ngutu",
        "areas":[
          "Ngutu Town Centre",
          "Ngutu Market",
          "Ngutu Hospital",
          "Ngutu Police Station"
          ]
      },
          {
        "town": "Rachariri",
        "areas":[
          "Rachariri Town Centre",
          "Rachariri Market",
          "Rachariri Hospital",
          "Rachariri Police Station"
          ]
      },
          {
        "town": "Sabasaba",
        "areas":[
          "Sabasaba Town Centre",
          "Sabasaba Market",
          "Sabasaba Hospital",
          "Sabasaba Police Station"
          ]
      },
          {
        "town": "Wempa",
        "areas":[
          "Wempa Town Centre",
          "Wempa Market",
          "Wempa Hospital",
          "Wempa Police Station"
          ]
      }
  
  
    ]
  },
  {
    "county": "Kirinyaga County",
    "towns": [
      {
        "town": "Kerugoya",
        "areas": [
          "Kerugoya Town Centre",
          "Kerugoya Market",
          "Kerugoya Hospital",
          "Kerugoya Stadium",
          "Kerugoya Police Station",
          "Kutus",
          "Wanguru",
          "Kibingo",
          "Gathigiriri",
          "Baricho",
          "Kangai",
          "Inoi",
          "Mutithi"
        ]
      },
      {
        "town": "Kutus",
        "areas": [
          "Kutus Town Centre",
          "Kutus Market",
          "Kutus Bus Park",
          "Kutus Railway Station",
          "Kutus Hospital",
          "Kutus Police Station",
          "Kerugoya (partially)",
          "Wanguru (partially)",
          "Kibingo (partially)",
          "Gathigiriri (partially)",
          "Baricho (partially)"
        ]
      },
      {
        "town": "Wanguru",
        "areas": [
          "Wanguru Town Centre",
          "Wanguru Market",
          "Wanguru Hospital",
          "Wanguru Police Station",
          "Mwea Irrigation Scheme",
          "Ahero Irrigation Scheme (partially)",
          "Kerugoya (partially)",
          "Kutus (partially)",
          "Kibingo (partially)",
          "Gathigiriri (partially)",
          "Baricho (partially)"
        ]
      },
      {
        "town": "Kibingo",
        "areas": [
          "Kibingo Market",
          "Kibingo Hospital",
          "Kibingo Police Station",
          "Kerugoya (partially)",
          "Kutus (partially)",
          "Wanguru (partially)",
          "Gathigiriri (partially)",
          "Baricho (partially)"
        ]
      },
      {
        "town": "Gathigiriri",
        "areas": [
          "Gathigiriri Market",
          "Gathigiriri Hospital",
          "Gathigiriri Police Station",
          "Kerugoya (partially)",
          "Kutus (partially)",
          "Wanguru (partially)",
          "Kibingo (partially)",
          "Baricho (partially)"
        ]
      },
      {
        "town": "Baricho",
        "areas": [
          "Baricho Market",
          "Baricho Hospital",
          "Baricho Police Station",
          "Kerugoya (partially)",
          "Kutus (partially)",
          "Wanguru (partially)",
          "Kibingo (partially)",
          "Gathigiriri (partially)"
        ]
      },
      {
        "town": "Tebere",
        "areas": [
          "Tebere Market",
          "Tebere Town",
          "Tebere Irrigation Scheme"
        ]
      },
       {
        "town": "Mutithi",
        "areas": [
          "Mutithi Market",
          "Mutithi Town",
          "Mutithi Irrigation Scheme"
        ]
      },
      {
        "town": "Inoi",
        "areas": [
          "Inoi Market",
          "Inoi Town"
        ]
      },
      {
        "town": "Kangai",
        "areas": [
          "Kangai Market",
          "Kangai Town"
        ]
      }
  
    ]
  },
  {
    "county": "Nairobi County",
    "towns": [
      {
        "town": "Nairobi City Centre",
        "areas": [
          "Central Business District (CBD)",
          "Upper Hill",
          "Westlands",
          "Kilimani",
          "Lavington",
          "Kileleshwa",
          "Hurlingham",
          "Milimani",
          "Community",
          "Nairobi Hill",
          "Pangani",
          "Ngara",
          "Parklands",
          "Highridge",
          "Spring Valley",
          "Riverside"
        ]
      },
      {
        "town": "Embakasi",
        "areas": [
          "Embakasi Village",
          "Imara Daima",
          "Pipeline",
          "Utawala",
          "Mihang'o",
          "Kayole",
          "Soweto",
          "Njiru",
          "Ruai"
        ]
      },
      {
        "town": "Kasaraani",
        "areas": [
          "Kasarani",
          "Mwiki",
          "Roysambu",
          "Kahawa West",
          "Kahawa Sukari",
          "Zimmerman",
          "Clay City",
          "Mountain View"
        ]
      },
      {
        "town": "Dagoretti",
        "areas": [
          "Dagoretti Corner",
          "Kawangware",
          "Waithaka",
          "Riruta",
          "Satellite",
          "Karen",
          "Lang'ata"
        ]
      },
      {
        "town": "Lang'ata",
        "areas": [
          "Lang'ata",
          "Karen",
          "South C",
          "Nairobi West",
          "Madaraka",
          "Mbagathi"
        ]
      },
      {
        "town": "Makadara",
        "areas": [
          "Makadara",
          "Jericho",
          "Bahati",
          "Uhuru",
          "Shauri Moyo",
          "California",
          "Eastleigh"
        ]
      },
      {
        "town": "Mathare",
        "areas": [
          "Mathare",
          "Huruma",
          "Kariobangi",
          "Dandora",
          "Githurai 44",
          "Lucky Summer"
        ]
      },
      {
        "town": "Starehe",
        "areas": [
          "Starehe",
          "Pangani",
          "Ngara",
          "Nairobi South",
          "City Park",
          "Muthaiga"
        ]
      },
      {
        "town": "Westlands",
        "areas": [
          "Westlands",
          "Parklands",
          "Highridge",
          "Spring Valley",
          "Riverside",
          "Kitisuru",
          "Loresho",
          "Gigiri"
        ]
      },
      {
        "town": "Kibra",
        "areas": [
          "Kibra",
          "Laini Saba",
          "Soweto",
          "Makina",
          "Kianda",
          "Gatwekera",
          "Ayany",
          "Mashimoni"
        ]
      },
      {
        "town": "Ruaraka",
        "areas": [
          "Ruaraka",
          "Mathare North",
          "Baba Dogo",
          "Utalii",
          "Kasurani",
          "Lucky Summer"
        ]
      },
      {
        "town": "Kamukunji",
        "areas": [
          "Kamukunji",
          "Pumwani",
          "Eastleigh North",
          "Eastleigh South",
          "Airbase"
        ]
      },
      {
        "town": "Njiru",
        "areas": [
          "Njiru",
          "Dandora",
          "Utawala",
          "Mihang'o",
          "Ruai",
          "Kayole"
        ]
      },
      {
        "town": "Kayole",
        "areas": [
          "Kayole",
          "Soweto",
          "Njiru",
          "Utawala",
          "Mihang'o"
        ]
      },
      {
        "town": "Utawala",
        "areas": [
          "Utawala",
          "Njiru",
          "Mihang'o",
          "Ruai",
          "Kayole"
        ]
      },
      {
        "town": "Mihang'o",
        "areas": [
          "Mihang'o",
          "Njiru",
          "Utawala",
          "Ruai",
          "Kayole"
        ]
      },
      {
        "town": "Ruai",
        "areas": [
          "Ruai",
          "Njiru",
          "Utawala",
          "Mihang'o",
          "Kayole"
        ]
      },
                  {
        "town": "Gigiri",
        "areas": [
          "Gigiri",
          "Muthaiga",
          "Runda",
          "Nyari",
          "UN Avenue",
          "Village Market"
        ]
      },
          {
        "town": "Karen",
        "areas": [
          "Karen",
          "Langata",
          "Hardy",
          "Kikuyu (bordering)",
          "Ngong (bordering)"
        ]
      },
          {
        "town": "Kilimani",
        "areas": [
          "Kilimani",
          "Hurlingham",
          "Yaya Centre Area",
          "State House Road Area"
        ]
      },
          {
        "town": "Lavington",
        "areas": [
          "Lavington",
          "Kileleshwa",
          "Kitisuru",
          "Loresho"
        ]
      },
          {
        "town": "Kileleshwa",
        "areas": [
          "Kileleshwa",
          "Lavington",
          "Kilimani"
        ]
      },
          {
        "town": "Muthaiga",
        "areas": [
          "Muthaiga",
          "Gigiri",
          "Runda",
          "Nyari"
        ]
      },
          {
        "town": "Runda",
        "areas": [
          "Runda",
          "Gigiri",
          "Muthaiga",
          "Nyari"
        ]
      },
          {
        "town": "Nyari",
        "areas": [
          "Nyari",
          "Gigiri",
          "Muthaiga",
          "Runda"
        ]
      },
          {
        "town": "South C",
        "areas": [
          "South C",
          "Langata",
          "Nairobi West"
        ]
      },
          {
        "town": "Nairobi West",
        "areas": [
          "Nairobi West",
          "Langata",
          "South C"
        ]
      },
          {
        "town": "Madaraka",
        "areas": [
          "Madaraka",
          "Langata",
          "Nairobi West"
        ]
      },
          {
        "town": "Mbagathi",
        "areas": [
          "Mbagathi",
          "Langata"
        ]
      },
          {
        "town": "Jericho",
        "areas": [
          "Jericho",
          "Makadara"
        ]
      },
          {
        "town": "Bahati",
        "areas": [
          "Bahati",
          "Makadara"
        ]
      },
          {
        "town": "Uhuru",
        "areas": [
          "Uhuru",
          "Makadara"
        ]
      },
          {
        "town": "Shauri Moyo",
        "areas": [
          "Shauri Moyo",
          "Makadara"
        ]
      },
    ]
  },
  {
    "county": "Kajiado County",
    "towns": [
      {
        "town": "Kajiado Town",
        "areas": [
          "Kajiado Town Centre",
          "Kajiado Market",
          "Kajiado County Hospital",
          "Kajiado Police Station",
          "Kajiado Railway Station",
          "Kajiado Bus Park",
          "Kajiado East",
          "Kajiado West",
          "Kajiado North",
          "Kajiado South",
          "Amboseli National Park (bordering areas)"
        ]
      },
      {
        "town": "Kitengela",
        "areas": [
          "Kitengela Town Centre",
          "EPZ Area",
          "Yukos",
          "Kagundo",
          "Noonkopir",
          "Oloolua",
          "Kitengela West",
          "Kitengela East",
          "Kitengela North",
          "Kitengela South",
          "Royal Park",
          "Imani Springs",
          "Acacia Park",
          "New Valley",
          "Moon Valley",
          "Eagle View"
        ]
      },
      {
        "town": "Ngong",
        "areas": [
          "Ngong Town Centre",
          "Ngong Market",
          "Ngong Hospital",
          "Ngong Police Station",
          "Ngong Railway Station",
          "Ngong Bus Park",
          "Ngong Hills",
          "Ongata Rongai",
          "Matasia",
          "Nairobi National Park (bordering areas)"
        ]
      },
      {
        "town": "Athi River",
        "areas": [
          "Athi River Town Centre",
          "Athi River Market",
          "Athi River Hospital",
          "Athi River Police Station",
          "Athi River Railway Station",
          "Athi River EPZ",
          "Mavoko",
          "Syokimau",
          "Katani",
          "Kinanie",
          "Daystar University Area",
          "JKIA (bordering areas)"
        ]
      },
      {
        "town": "Namanga",
        "areas": [
          "Namanga Town Centre",
          "Namanga Border Point (Kenya-Tanzania)",
          "Namanga Market",
          "Namanga Hills",
          "Namanga River",
          "Longido (Tanzania) (bordering areas)"
        ]
      },
      {
        "town": "Isinya",
        "areas": [
          "Isinya Town Centre",
          "Isinya Market",
          "Isinya Hospital",
          "Isinya Police Station",
          "Isinya Railway Station",
          "Isinya Bus Park",
          "Konza Techno City (bordering areas)"
        ]
      },
      {
        "town": "Oloitokitok",
        "areas": [
          "Oloitokitok Town Centre",
          "Oloitokitok Market",
          "Oloitokitok Hospital",
          "Oloitokitok Police Station",
          "Oloitokitok Airstrip",
          "Kimana",
          "Loitokitok",
          "Emali (bordering areas)",
          "Tanzania (bordering areas)",
          "Chyulu Hills National Park (bordering areas)"
        ]
      },
      {
        "town": "Ongata Rongai",
        "areas": [
          "Ongata Rongai Town Centre",
          "Ongata Rongai Market",
          "Ongata Rongai Shopping Centre",
          "Kiserian (bordering areas)",
          "Ngong (bordering areas)",
          "Karen (bordering areas)"
        ]
      },
      {
        "town": "Kiserian",
        "areas": [
          "Kiserian Town Centre",
          "Kiserian Market",
          "Kiserian Shopping Centre",
          "Kiserian Dam",
          "Ngong (bordering areas)",
          "Kitengela (bordering areas)"
        ]
      },
      {
        "town": "Mashuru",
        "areas": [
          "Mashuru Town",
          "Mashuru Market",
          "Mashuru Dispensary",
          "Mashuru Primary School",
          "Mashuru Secondary School"
        ]
      },
      {
        "town": "Bisil",
        "areas": [
          "Bisil Town",
          "Bisil Market",
          "Bisil Dispensary",
          "Bisil Primary School"
        ]
      },
      {
        "town": "Eselenkei",
        "areas": [
          "Eselenkei Town",
          "Eselenkei Market",
          "Eselenkei Dispensary",
          "Eselenkei Primary School"
        ]
      },
      {
        "town": "Torosei",
        "areas": [
          "Torosei Town",
          "Torosei Market",
          "Torosei Dispensary",
          "Torosei Primary School"
        ]
      },
      {
        "town": "Kimana",
        "areas": [
          "Kimana Town",
          "Kimana Market",
          "Kimana Dispensary",
          "Kimana Primary School",
          "Kimana Secondary School"
        ]
      },
      {
        "town": "Ilasit",
        "areas": [
          "Ilasit Town",
          "Ilasit Market",
          "Ilasit Dispensary",
          "Ilasit Primary School"
        ]
      },
      {
        "town": "Imaroro",
        "areas": [
          "Imaroro Town",
          "Imaroro Market",
          "Imaroro Dispensary",
          "Imaroro Primary School"
        ]
      },
      {
        "town": "Inkajido",
        "areas": [
          "Inkajido Town",
          "Inkajido Market",
          "Inkajido Dispensary",
          "Inkajido Primary School"
        ]
      },
      {
        "town": "Lukenya",
        "areas": [
          "Lukenya Town",
          "Lukenya Market",
          "Lukenya Dispensary",
          "Lukenya Primary School"
        ]
      },
      {
        "town": "Maili 46",
        "areas": [
          "Maili 46 Town",
          "Maili 46 Market",
          "Maili 46 Dispensary",
          "Maili 46 Primary School"
        ]
      },
      {
        "town": "Mapelu",
        "areas": [
          "Mapelu Town",
          "Mapelu Market",
          "Mapelu Dispensary",
          "Mapelu Primary School"
        ]
      },
      {
        "town": "Matapato",
        "areas": [
          "Matapato Town",
          "Matapato Market",
          "Matapato Dispensary",
          "Matapato Primary School"
        ]
      },
      {
        "town": "Mbetei",
        "areas": [
          "Mbetei Town",
          "Mbetei Market",
          "Mbetei Dispensary",
          "Mbetei Primary School"
        ]
      },
      {
        "town": "Metipso",
        "areas": [
          "Metipso Town",
          "Metipso Market",
          "Metipso Dispensary",
          "Metipso Primary School"
        ]
      },
      {
        "town": "Munduli",
        "areas": [
          "Munduli Town",
          "Munduli Market",
          "Munduli Dispensary",
          "Munduli Primary School"
        ]
      },
      {
        "town": "Namelok",
        "areas": [
          "Namelok Town",
          "Namelok Market",
          "Namelok Dispensary",
          "Namelok Primary School"
        ]
      },
      {
        "town": "Olturoto",
        "areas": [
          "Olturoto Town",
          "Olturoto Market",
          "Olturoto Dispensary",
          "Olturoto Primary School"
        ]
      },
    ]
  },
  {
    "county": "Machakos County",
    "towns": [
      {
        "town": "Machakos Town",
        "areas": [
          "Machakos Town Centre",
          "Machakos County Referral Hospital",
          "Machakos University Area",
          "Machakos Institute of Technology Area",
          "Machakos Stadium",
          "Machakos Market",
          "Machakos Post Office",
          "Mavoko (bordering areas)",
          "Kathiani (bordering areas)",
          "Masinga (bordering areas)",
          "Yatta (bordering areas)",
          "Matungulu (bordering areas)",
          "Kangundo (bordering areas)",
          "Mwala (bordering areas)"
        ]
      },
      {
        "town": "Mavoko",
        "areas": [
          "Mavoko Town Centre",
          "Athi River (bordering areas)",
          "Syokimau",
          "Katani",
          "Kinanie",
          "Daystar University Area",
          "EPZ Area",
          "JKIA (bordering areas)"
        ]
      },
      {
        "town": "Kathiani",
        "areas": [
          "Kathiani Town Centre",
          "Kathiani Market",
          "Kathiani Hospital",
          "Kathiani Police Station",
          "Kathiani Boys High School",
          "Kathiani Girls High School",
          "Machakos (bordering areas)",
          "Kangundo (bordering areas)"
        ]
      },
      {
        "town": "Kangundo",
        "areas": [
          "Kangundo Town Centre",
          "Kangundo Market",
          "Kangundo Hospital",
          "Kangundo Police Station",
          "Kangundo Boys High School",
          "Kangundo Girls High School",
          "Machakos (bordering areas)",
          "Kathiani (bordering areas)",
          "Mwala (bordering areas)"
        ]
      },
      {
        "town": "Mwala",
        "areas": [
          "Mwala Town Centre",
          "Mwala Market",
          "Mwala Hospital",
          "Mwala Police Station",
          "Mwala Boys High School",
          "Mwala Girls High School",
          "Kangundo (bordering areas)",
          "Machakos (bordering areas)",
          "Embu County (bordering areas)"
        ]
      },
      {
        "town": "Masinga",
        "areas": [
          "Masinga Town Centre",
          "Masinga Market",
          "Masinga Dam",
          "Masinga Hospital",
          "Masinga Police Station",
          "Masinga Boys High School",
          "Masinga Girls High School",
          "Machakos (bordering areas)",
          "Embu County (bordering areas)"
        ]
      },
      {
        "town": "Yatta",
        "areas": [
          "Yatta Town Centre",
          "Yatta Market",
          "Yatta Canal",
          "Yatta Plateau",
          "Machakos (bordering areas)",
          "Kitui County (bordering areas)"
        ]
      },
      {
        "town": "Matungulu",
        "areas": [
          "Matungulu Town Centre",
          "Matungulu Market",
          "Matungulu Hospital",
          "Matungulu Police Station",
          "Matungulu Boys High School",
          "Matungulu Girls High School",
          "Machakos (bordering areas)",
          "Kiambu County (bordering areas)"
        ]
      },
      {
        "town": "Syokimau",
        "areas": [
          "Syokimau",
          "Athi River (bordering areas)",
          "Mavoko (bordering areas)"
        ]
      },
      {
        "town": "Katani",
        "areas": [
          "Katani",
          "Athi River (bordering areas)",
          "Mavoko (bordering areas)"
        ]
      },
      {
        "town": "Kinanie",
        "areas": [
          "Kinanie",
          "Athi River (bordering areas)",
          "Mavoko (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Nakuru County",
    "towns": [
      {
        "town": "Nakuru",
        "areas": [
          "Nakuru Town Centre",
          "Milimani",
          "Kiamunyi",
          "Bahati",
          "Rongai",
          "London",
          "Menengai",
          "Nakuru West",
          "Nakuru East",
          "Nakuru North",
          "Nakuru South",
          "Industrial Area",
          "Lake Nakuru National Park (bordering areas)"
        ]
      },
      {
        "town": "Naivasha",
        "areas": [
          "Naivasha Town Centre",
          "Industrial Area",
          "Karagita",
          "Site and Service",
          "Mirera",
          "Longonot",
          "Mai Mahiu",
          "Kinamba",
          "Kongoni",
          "South Lake",
          "Crescent Island",
          "Hell's Gate National Park Area",
          "Fisherman's Camp",
          "Lake Naivasha Area"
        ]
      },
      {
        "town": "Gilgil",
        "areas": [
          "Gilgil Town Centre",
          "Kariandusi",
          "Elementaita",
          "Mbaruk",
          "Nderit",
          "Lake Elementaita (bordering areas)",
          "Soysambu Conservancy (bordering areas)"
        ]
      },
      {
        "town": "Molo",
        "areas": [
          "Molo Town Centre",
          "Molo Market",
          "Molo Hospital",
          "Molo Police Station",
          "Molo Railway Station",
          "Molo Forest",
          "Turi",
          "Keringet",
          "Sachangwan",
          "Mau Summit (bordering areas)"
        ]
      },
      {
        "town": "Njoro",
        "areas": [
          "Njoro Town Centre",
          "Njoro Market",
          "Njoro Hospital",
          "Njoro Police Station",
          "Egerton University Area",
          "Njoro Research Centre",
          "Lare",
          "Nessuit",
          "Mau Narok (bordering areas)"
        ]
      },
      {
        "town": "Ol Kalou",
        "areas": [
          "Ol Kalou Town Centre",
          "Ol Kalou Market",
          "Ol Kalou Hospital",
          "Ol Kalou Police Station",
          "Shamata",
          "Gathanji",
          "Kabati",
          "Ndunyu Njeru",
          "Kinangop (bordering areas)"
        ]
      },
      {
        "town": "Subukia",
        "areas": [
          "Subukia Town Centre",
          "Subukia Market",
          "Subukia Shrine",
          "Subukia Valley",
          "Wanjohi",
          "Mutalia",
          "Solai (bordering areas)"
        ]
      },
      {
        "town": "Bahati",
        "areas": [
          "Bahati Town",
          "Bahati Centre",
          "Bahati Salient",
          "Nakuru (bordering areas)"
        ]
      },
      {
        "town": "Rongai",
        "areas": [
          "Rongai Town",
          "Rongai Centre",
          "Rongai Agricultural Showground",
          "Nakuru (bordering areas)"
        ]
      },
      {
        "town": "Mai Mahiu",
        "areas": [
          "Mai Mahiu Town Centre",
          "Mai Mahiu Market",
          "Mai Mahiu Hospital",
          "Mai Mahiu Railway Station",
          "Mai Mahiu Geothermal Power Station",
          "Longonot (bordering areas)",
          "Suswa (bordering areas)"
        ]
      },
      {
        "town": "Kinamba",
        "areas": [
          "Kinamba Town",
          "Kinamba Market",
          "Kinamba Shopping Centre",
          "Naivasha (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Narok County",
    "towns": [
      {
        "town": "Narok",
        "areas": [
          "Narok Town Centre",
          "Narok Market",
          "Narok County Hospital",
          "Narok Stadium",
          "Narok Post Office",
          "Maa Museum",
          "Narok East",
          "Narok West",
          "Narok North",
          "Narok South"
        ]
      },
      {
        "town": "Siana",
        "areas": [
          "Siana Town",
          "Siana Market",
          "Siana Dispensary",
          "Siana Primary School"
        ]
      },
      {
        "town": "Kilgoris",
        "areas": [
          "Kilgoris Town Centre",
          "Kilgoris Market",
          "Kilgoris Hospital",
          "Kilgoris Police Station",
          "Kilgoris Boys High School",
          "Kilgoris Girls High School"
        ]
      },
      {
        "town": "Emurua Dikirr",
        "areas": [
          "Emurua Dikirr Town",
          "Emurua Dikirr Market",
          "Emurua Dikirr Hospital",
          "Emurua Dikirr Police Station"
        ]
      },
      {
        "town": "Lolgorian",
        "areas": [
          "Lolgorian Town",
          "Lolgorian Market",
          "Lolgorian Dispensary",
          "Lolgorian Primary School"
        ]
      },
      {
        "town": "Mau Narok",
        "areas": [
          "Mau Narok Town",
          "Mau Narok Market",
          "Mau Narok Dispensary",
          "Mau Narok Primary School"
        ]
      },
      {
        "town": "Ngoreme",
        "areas": [
          "Ngoreme Town",
          "Ngoreme Market",
          "Ngoreme Dispensary",
          "Ngoreme Primary School"
        ]
      },
      {
        "town": "Ntulele",
        "areas": [
          "Ntulele Town",
          "Ntulele Market",
          "Ntulele Dispensary",
          "Ntulele Primary School"
        ]
      },
      {
        "town": "Olkirorok",
        "areas": [
          "Olkirorok Town",
          "Olkirorok Market",
          "Olkirorok Dispensary",
          "Olkirorok Primary School"
        ]
      },
      {
        "town": "Partirr",
        "areas": [
          "Partirr Town",
          "Partirr Market",
          "Partirr Dispensary",
          "Partirr Primary School"
        ]
      },
      {
        "town": "Sogoo",
        "areas": [
          "Sogoo Town",
          "Sogoo Market",
          "Sogoo Dispensary",
          "Sogoo Primary School"
        ]
      },
      {
        "town": "Suswa",
        "areas": [
          "Suswa Town",
          "Suswa Market",
          "Suswa Dispensary",
          "Suswa Primary School",
          "Suswa Railway Station",
          "Suswa Volcano"
        ]
      },
      {
        "town": "Talek",
        "areas": [
          "Talek Town",
          "Talek Market",
          "Talek Dispensary",
          "Talek Primary School"
        ]
      },
      {
        "town": "Tindiret",
        "areas": [
          "Tindiret Town",
          "Tindiret Market",
          "Tindiret Dispensary",
          "Tindiret Primary School"
        ]
      }
    ]
  },
  {
    "county": "Embu County",
    "towns": [
      {
        "town": "Embu Town",
        "areas": [
          "Embu Town Centre",
          "Embu County Hospital",
          "Embu Stadium",
          "Embu Market",
          "Embu Post Office",
          "University of Embu Area",
          "Kenya School of Government (Embu Campus) Area",
          "Kangaru School Area",
          "Njukiri Forest",
          "Gakoromone",
          "Makutano",
          "Kinoru",
          "Gitimbine",
          "Mwiteria"
        ]
      },
      {
        "town": "Runyenjes",
        "areas": [
          "Runyenjes Town Centre",
          "Runyenjes Market",
          "Runyenjes Hospital",
          "Runyenjes Police Station",
          "Runyenjes Boys High School",
          "Runyenjes Girls High School",
          "Embu (bordering areas)",
          "Chuka (bordering areas)"
        ]
      },
      {
        "town": "Manyatta",
        "areas": [
          "Manyatta Town Centre",
          "Manyatta Market",
          "Manyatta Hospital",
          "Manyatta Police Station",
          "Embu (bordering areas)",
          "Mbeere (bordering areas)"
        ]
      },
      {
        "town": "Ishiara",
        "areas": [
          "Ishiara Town Centre",
          "Ishiara Market",
          "Ishiara Hospital",
          "Ishiara Police Station",
          "Embu (bordering areas)",
          "Kitui County (bordering areas)"
        ]
      },
      {
        "town": "Mbeere",
        "areas": [
          "Mbeere South",
          "Mbeere North",
          "Siakago",
          "Gachoka",
          "Kiritiri",
          "Embu (bordering areas)",
          "Kitui County (bordering areas)",
          "Machakos County (bordering areas)"
        ]
      },
          {
        "town": "Siakago",
        "areas": [
          "Siakago Town Centre",
          "Siakago Market",
          "Siakago Hospital",
          "Siakago Police Station",
          "Mbeere (bordering areas)"
        ]
      },
          {
        "town": "Gachoka",
        "areas": [
          "Gachoka Town Centre",
          "Gachoka Market",
          "Gachoka Hospital",
          "Gachoka Police Station",
          "Mbeere (bordering areas)"
        ]
      },
          {
        "town": "Kiritiri",
        "areas": [
          "Kiritiri Town Centre",
          "Kiritiri Market",
          "Kiritiri Hospital",
          "Kiritiri Police Station",
          "Mbeere (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Meru County",
    "towns": [
      {
        "town": "Meru Town",
        "areas": [
          "Meru Town Centre",
          "Gakoromone",
          "Makutano",
          "Kinoru",
          "Gitimbine",
          "Mwiteria",
          "Meru National Polytechnic Area",
          "Meru University of Science and Technology (MUST) Area",
          "Meru Teaching and Referral Hospital Area",
          "Meru County Headquarters Area"
        ]
      },
      {
        "town": "Nkubu",
        "areas": [
          "Nkubu Town Centre",
          "Nkubu Market",
          "Nkubu Hospital",
          "Nkubu Police Station"
        ]
      },
      {
        "town": "Maua",
        "areas": [
          "Maua Town Centre",
          "Maua Market",
          "Maua Hospital",
          "Maua Police Station"
        ]
      },
      {
        "town": "Embu",
        "areas": [
          "Embu Town Centre",
          "Ishiara",
          "Runyenjes",
          "Manyatta",
          "Mbeere"
        ]
      },
      {
        "town": "Nanyuki",
        "areas": [
          "Nanyuki Town Centre",
          "Timau",
          "Dol Dol",
          "Rumuruti",
          "Naro Moru",
          "Sirimon",
          "Burguret",
          "Mukogodo"
        ]
      },
      {
        "town": "Isiolo",
        "areas": [
          "Isiolo Town Centre",
          "Kulamawe",
          "Kiwanja",
          "Ngare Ndare",
          "Oldonyiro",
          "Garba Tula",
          "Merti",
          "Sericho",
          "Kinna",
          "Modogashe"
        ]
      },
      {
        "town": "Chuka",
        "areas": [
          "Chuka Town Centre",
          "Chogoria",
          "Kaanwa",
          "Marimanti"
        ]
      },
      {
        "town": "Tharaka Nithi",
        "areas": [
          "Kathwana",
          "Gatunga",
          "Marimanti",
          "Chiakariga",
          "Ikamari"
        ]
      },
      {
        "town": "Igoji",
        "areas": [
          "Igoji Town",
          "Igoji Market",
          "Igoji Hospital",
          "Igoji Police Station"
        ]
      },
      {
        "town": "Mutuati",
        "areas": [
          "Mutuati Town",
          "Mutuati Market",
          "Mutuati Hospital",
          "Mutuati Police Station"
        ]
      },
      {
        "town": "Lare",
        "areas": [
          "Lare Town",
          "Lare Market",
          "Lare Hospital",
          "Lare Police Station"
        ]
      },
      {
        "town": "Kiirua",
        "areas": [
          "Kiirua Town",
          "Kiirua Market",
          "Kiirua Hospital",
          "Kiirua Police Station"
        ]
      },
      {
        "town": "Ruiri",
        "areas": [
          "Ruiri Town",
          "Ruiri Market",
          "Ruiri Hospital",
          "Ruiri Police Station"
        ]
      },
      {
        "town": "Katheri",
        "areas": [
          "Katheri Town",
          "Katheri Market",
          "Katheri Hospital",
          "Katheri Police Station"
        ]
      },
      {
        "town": "Mitunguu",
        "areas": [
          "Mitunguu Town",
          "Mitunguu Market",
          "Mitunguu Hospital",
          "Mitunguu Police Station"
        ]
      }
    ]
  },
  {
    "county": "Nyandarua County",
    "towns": [
      {
        "town": "Ol Kalou",
        "areas": [
          "Ol Kalou Town Centre",
          "Ol Kalou Market",
          "Ol Kalou Hospital",
          "Ol Kalou Police Station",
          "Shamata",
          "Gathanji",
          "Kabati",
          "Ndunyu Njeru",
          "Kinangop (bordering areas)"
        ]
      },
      {
        "town": "Nyahururu",
        "areas": [
          "Nyahururu Town Centre",
          "Nyahururu Market",
          "Nyahururu Hospital",
          "Nyahururu Police Station",
          "Thomson's Falls",
          "Rumuruti (bordering areas)",
          "Laikipia County (bordering areas)"
        ]
      },
      {
        "town": "Engineer",
        "areas": [
          "Engineer Town",
          "Engineer Market",
          "Engineer Hospital",
          "Engineer Police Station",
          "Kinangop (bordering areas)"
        ]
      },
      {
        "town": "Kinangop",
        "areas": [
          "Kinangop Town",
          "Kinangop Market",
          "Kinangop Plateau",
          "Engineer (bordering areas)",
          "Naivasha (bordering areas)"
        ]
      },
      {
        "town": "Mawingo",
        "areas": [
          "Mawingo Town",
          "Mawingo Market",
          "Mawingo Dispensary"
        ]
      },
          {
        "town": "Geta",
        "areas": [
          "Geta Town",
          "Geta Market",
          "Geta Dispensary"
        ]
      },
          {
        "town": "Wanjohi",
        "areas": [
          "Wanjohi Town",
          "Wanjohi Market",
          "Wanjohi Dispensary"
        ]
      },
          {
        "town": "Mutalia",
        "areas": [
          "Mutalia Town",
          "Mutalia Market",
          "Mutalia Dispensary"
        ]
      },
          {
        "town": "Kipipiri",
        "areas": [
          "Kipipiri Town",
          "Kipipiri Market",
          "Kipipiri Dispensary"
        ]
      },
      {
        "town": "Ndunyu Njeru",
        "areas": [
          "Ndunyu Njeru Town",
          "Ndunyu Njeru Market",
          "Ndunyu Njeru Dispensary"
        ]
      },
      {
        "town": "Shamata",
        "areas": [
          "Shamata Town",
          "Shamata Market",
          "Shamata Dispensary"
        ]
      },
      {
        "town": "Gathanji",
        "areas": [
          "Gathanji Town",
          "Gathanji Market",
          "Gathanji Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Laikipia County",
    "towns": [
      {
        "town": "Nanyuki",
        "areas": [
          "Nanyuki Town Centre",
          "Nanyuki Airport",
          "Nanyuki Railway Station",
          "Nanyuki Market",
          "Nanyuki County Referral Hospital",
          "Nanyuki Police Station",
          "Nanyuki Airbase",
          "Mount Kenya National Park (bordering areas)",
          "Ol Pejeta Conservancy (bordering areas)",
          "Lewa Wildlife Conservancy (bordering areas)",
          "Samburu National Reserve (bordering areas)"
        ]
      },
      {
        "town": "Rumuruti",
        "areas": [
          "Rumuruti Town Centre",
          "Rumuruti Market",
          "Rumuruti Hospital",
          "Rumuruti Police Station",
          "Rumuruti Livestock Market",
          "Laikipia Nature Conservancy (bordering areas)"
        ]
      },
      {
        "town": "Dol Dol",
        "areas": [
          "Dol Dol Town Centre",
          "Dol Dol Market",
          "Dol Dol Dispensary",
          "Dol Dol Primary School",
          "Dol Dol Secondary School"
        ]
      },
      {
        "town": "Timau",
        "areas": [
          "Timau Town Centre",
          "Timau Market",
          "Timau Dispensary",
          "Timau Primary School",
          "Timau Secondary School"
        ]
      },
      {
        "town": "Naro Moru",
        "areas": [
          "Naro Moru Town Centre",
          "Naro Moru Market",
          "Naro Moru Hospital",
          "Naro Moru Police Station",
          "Mount Kenya National Park (bordering areas)"
        ]
      },
      {
        "town": "Sirimon",
        "areas": [
          "Sirimon Gate (Mount Kenya National Park)",
          "Sirimon River",
          "Sirimon Meteorological Station",
          "Sirimon Primary School"
        ]
      },
      {
        "town": "Kinamba",
        "areas": [
          "Kinamba Town",
          "Kinamba Market",
          "Kinamba Dispensary",
          "Kinamba Primary School"
        ]
      },
      {
        "town": "Sipili",
        "areas": [
          "Sipili Town",
          "Sipili Market",
          "Sipili Dispensary",
          "Sipili Primary School"
        ]
      },
      {
        "town": "Mugogodo",
        "areas": [
          "Mugogodo Town",
          "Mugogodo Market",
          "Mugogodo Dispensary",
          "Mugogodo Primary School"
        ]
      },
      {
        "town": "Kalalu",
        "areas": [
          "Kalalu Town",
          "Kalalu Market",
          "Kalalu Dispensary",
          "Kalalu Primary School"
        ]
      },
          {
        "town": "Igwamiti",
        "areas": [
          "Igwamiti Town",
          "Igwamiti Market",
          "Igwamiti Dispensary",
          "Igwamiti Primary School"
        ]
      },
          {
        "town": "Salama",
        "areas": [
          "Salama Town",
          "Salama Market",
          "Salama Dispensary",
          "Salama Primary School"
        ]
      },
          {
        "town": "Matanya",
        "areas": [
          "Matanya Town",
          "Matanya Market",
          "Matanya Dispensary",
          "Matanya Primary School"
        ]
      },
          {
        "town": "Jua Kali",
        "areas": [
          "Jua Kali Town",
          "Jua Kali Market",
          "Jua Kali Dispensary",
          "Jua Kali Primary School"
        ]
      }
    ]
  },
  {
    "county": "Kericho County",
    "towns": [
      {
        "town": "Kericho",
        "areas": [
          "Kericho Town Centre",
          "Kericho County Hospital",
          "Kericho University",
          "Kericho Tea Hotel",
          "Kericho Green Stadium",
          "Kericho Market",
          "Kericho Bus Park",
          "Kericho Police Station",
          "Industrial Area",
          "Kipchimchim",
          "Chebsoi",
          "Kapsoit",
          "Kapsaos",
          "Kipkelion (partially)",
          "Litein (partially)",
          "Sotik (partially)"
        ]
      },
      {
        "town": "Litein",
        "areas": [
          "Litein Town Centre",
          "Litein Market",
          "Litein Hospital",
          "Litein Police Station",
          "Litein Tea Factory",
          "Kericho (partially)",
          "Kipkelion (partially)",
          "Sotik (partially)"
        ]
      },
      {
        "town": "Sotik",
        "areas": [
          "Sotik Town Centre",
          "Sotik Market",
          "Sotik Hospital",
          "Sotik Police Station",
          "Sotik Tea Factory",
          "Kericho (partially)",
          "Litein (partially)",
          "Bomet County (bordering areas)"
        ]
      },
      {
        "town": "Kipkelion",
        "areas": [
          "Kipkelion Town Centre",
          "Kipkelion Market",
          "Kipkelion Hospital",
          "Kipkelion Police Station",
          "Kipkelion Tea Factory",
          "Kericho (partially)",
          "Litein (partially)",
          "Londiani (bordering areas)"
        ]
      },
      {
        "town": "Ainamoi",
        "areas": [
          "Ainamoi Centre",
          "Kapkoros",
          "Kapsogot",
          "Kiptere",
          "Kipchimchim (partially)",
          "Kericho (partially)"
        ]
      },
      {
          "town": "Belgut",
          "areas": [
            "Belgut Centre",
            "Kapsabet",
            "Chepkongony",
            "Kipsegon",
            "Kipkelion (partially)",
            "Kericho (partially)"
          ]
        },
        {
          "town": "Bureti",
          "areas": [
            "Bureti Centre",
            "Chemosot",
            "Kipreres",
            "Roret",
            "Sotik (partially)",
            "Kericho (partially)"
          ]
        },
        {
          "town": "Chepalungu",
          "areas": [
            "Chepalungu Centre",
            "Sigor",
            "Siongiroi",
            "Kipkebe",
            "Bomet County (bordering areas)"
          ]
        }
    ]
  },
  {
    "county": "Bomet County",
    "towns": [
      {
        "town": "Bomet",
        "areas": [
          "Bomet Town Centre",
          "Bomet Market",
          "Bomet County Hospital",
          "Bomet University College",
          "Bomet Stadium",
          "Bomet Post Office",
          "Bomet East",
          "Bomet Central",
          "Bomet West",
          "Sotik (bordering areas)",
          "Narok County (bordering areas)",
          "Kericho County (bordering areas)"
        ]
      },
      {
        "town": "Sotik",
        "areas": [
          "Sotik Town Centre",
          "Sotik Market",
          "Sotik Hospital",
          "Sotik Police Station",
          "Sotik Tea Estate",
          "Sotik Highlands",
          "Bomet (bordering areas)",
          "Kericho County (bordering areas)",
          "Kisii County (bordering areas)"
        ]
      },
      {
        "town": "Litein",
        "areas": [
          "Litein Town Centre",
          "Litein Market",
          "Litein Hospital",
          "Litein Tea Factory",
          "Kericho County (bordering areas)",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Chemelil",
        "areas": [
          "Chemelil Town",
          "Chemelil Market",
          "Chemelil Sugar Factory",
          "Kericho County (bordering areas)"
        ]
      },
      {
        "town": "Kaplong",
        "areas": [
          "Kaplong Town",
          "Kaplong Market",
          "Kaplong Mission Hospital",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Sigor",
        "areas": [
          "Sigor Town",
          "Sigor Market",
          "Sigor Dispensary",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Mogogosiek",
        "areas": [
          "Mogogosiek Town",
          "Mogogosiek Market",
          "Mogogosiek Dispensary",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Kipreres",
        "areas": [
          "Kipreres Town",
          "Kipreres Market",
          "Kipreres Dispensary",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Ndanai",
        "areas": [
          "Ndanai Town",
          "Ndanai Market",
          "Ndanai Dispensary",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Siongiroi",
        "areas": [
          "Siongiroi Town",
          "Siongiroi Market",
          "Siongiroi Dispensary",
          "Bomet (bordering areas)"
        ]
      },
      {
        "town": "Kimulot",
        "areas": [
          "Kimulot Town",
          "Kimulot Market",
          "Kimulot Dispensary",
          "Bomet (bordering areas)"
        ]
      }
  
    ]
  },
  {
    "county": "Kitui County",
    "towns": [
      {
        "town": "Kitui",
        "areas": [
          "Kitui Town Centre",
          "Kitui Market",
          "Kitui County Referral Hospital",
          "Kitui National Polytechnic",
          "Kitui Stadium",
          "Kwa Vonza",
          "Kyangwithya",
          "Mulutu",
          "Ithooko",
          "Mwingi (bordering areas)",
          "Embu County (bordering areas)",
          "Machakos County (bordering areas)",
          "Tana River County (bordering areas)"
        ]
      },
      {
        "town": "Mwingi",
        "areas": [
          "Mwingi Town Centre",
          "Mwingi Market",
          "Mwingi Level 4 Hospital",
          "Mwingi Boys High School",
          "Mwingi Girls High School",
          "Mwingi North",
          "Mwingi Central",
          "Mwingi West",
          "Mwingi East",
          "Kitui (bordering areas)",
          "Garissa County (bordering areas)",
          "Tana River County (bordering areas)"
        ]
      },
      {
        "town": "Mutomo",
        "areas": [
          "Mutomo Town Centre",
          "Mutomo Market",
          "Mutomo Hospital",
          "Mutomo Catholic Church",
          "Mutomo Boys Secondary School",
          "Mutomo Girls Secondary School",
          "Ikutha",
          "Kyuso",
          "Mwingi (bordering areas)"
        ]
      },
      {
        "town": "Ikutha",
        "areas": [
          "Ikutha Town Centre",
          "Ikutha Market",
          "Ikutha Hospital",
          "Ikutha Police Station",
          "Ikutha Boys Secondary School",
          "Ikutha Girls Secondary School",
          "Mutomo (bordering areas)",
          "Kyuso (bordering areas)"
        ]
      },
      {
        "town": "Kyuso",
        "areas": [
          "Kyuso Town Centre",
          "Kyuso Market",
          "Kyuso Hospital",
          "Kyuso Police Station",
          "Kyuso Boys Secondary School",
          "Kyuso Girls Secondary School",
          "Mutomo (bordering areas)",
          "Ikutha (bordering areas)"
        ]
      },
      {
        "town": "Mati",
        "areas": [
          "Mati Town",
          "Mati Market",
          "Mati Dispensary",
          "Mati Primary School"
        ]
      },
      {
        "town": "Kibwea",
        "areas": [
          "Kibwea Town",
          "Kibwea Market",
          "Kibwea Dispensary",
          "Kibwea Primary School"
        ]
      },
      {
        "town": "Endau",
        "areas": [
          "Endau Town",
          "Endau Market",
          "Endau Dispensary",
          "Endau Primary School"
        ]
      },
      {
        "town": "Tseikuru",
        "areas": [
          "Tseikuru Town",
          "Tseikuru Market",
          "Tseikuru Dispensary",
          "Tseikuru Primary School"
        ]
      },
      {
        "town": "Voo",
        "areas": [
          "Voo Town",
          "Voo Market",
          "Voo Dispensary",
          "Voo Primary School"
        ]
      },
          {
        "town": "Nuu",
        "areas": [
          "Nuu Town",
          "Nuu Market",
          "Nuu Dispensary",
          "Nuu Primary School"
        ]
      }
    ]
  },
  {
    "county": "Makueni County",
    "towns": [
      {
        "town": "Wote",
        "areas": [
          "Wote Town Centre",
          "Wote Market",
          "Wote County Referral Hospital",
          "Wote Police Station",
          "Wote Bus Park",
          "Wote Stadium",
          "Wote Agricultural Training Centre",
          "Nziu",
          "Kathonzweni",
          "Mavindini",
          "Unoa",
          "Mukaa",
          "Kilungu"
        ]
      },
      {
        "town": "Makindu",
        "areas": [
          "Makindu Town Centre",
          "Makindu Market",
          "Makindu Railway Station",
          "Makindu Bus Park",
          "Makindu Hospital",
          "Makindu Police Station",
          "Kibwezi (bordering areas)",
          "Emali (bordering areas)"
        ]
      },
      {
        "town": "Sultan Hamud",
        "areas": [
          "Sultan Hamud Town Centre",
          "Sultan Hamud Market",
          "Sultan Hamud Railway Station",
          "Sultan Hamud Bus Park",
          "Sultan Hamud Hospital",
          "Sultan Hamud Police Station",
          "Emali (bordering areas)",
          "Kibwezi (bordering areas)"
        ]
      },
      {
        "town": "Emali",
        "areas": [
          "Emali Town Centre",
          "Emali Market",
          "Emali Railway Station",
          "Emali Bus Park",
          "Emali Hospital",
          "Emali Police Station",
          "Loitokitok (bordering areas)",
          "Makindu (bordering areas)",
          "Sultan Hamud (bordering areas)"
        ]
      },
      {
        "town": "Kibwezi",
        "areas": [
          "Kibwezi Town Centre",
          "Kibwezi Market",
          "Kibwezi Railway Station",
          "Kibwezi Forest",
          "Makindu (bordering areas)",
          "Emali (bordering areas)"
        ]
      },
      {
        "town": "Mbooni",
        "areas": [
          "Mbooni Town",
          "Mbooni Market",
          "Mbooni Hills",
          "Mbooni East",
          "Mbooni West",
          "Mbooni North",
          "Mbooni South"
        ]
      },
      {
        "town": "Matuu",
        "areas": [
          "Matuu Town",
          "Matuu Market",
          "Matuu Hospital",
          "Matuu Police Station",
          "Makueni (bordering areas)",
          "Machakos County (bordering areas)"
        ]
      },
      {
        "town": "Kathonzweni",
        "areas": [
          "Kathonzweni Town",
          "Kathonzweni Market",
          "Kathonzweni Hospital",
          "Kathonzweni Police Station"
        ]
      },
      {
        "town": "Nziu",
        "areas": [
          "Nziu Town",
          "Nziu Market",
          "Nziu Hospital",
          "Nziu Police Station"
        ]
      },
      {
        "town": "Unoa",
        "areas": [
          "Unoa Town",
          "Unoa Market",
          "Unoa Dispensary"
        ]
      },
      {
        "town": "Mukaa",
        "areas": [
          "Mukaa Town",
          "Mukaa Market",
          "Mukaa Dispensary"
        ]
      },
  {
        "town": "Kilungu",
        "areas": [
          "Kilungu Town",
          "Kilungu Market",
          "Kilungu Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Mombasa County",
    "towns": [
      {
        "town": "Mombasa Island",
        "areas": [
          "Mombasa City Centre (CBD)",
          "Fort Jesus Area",
          "Old Town",
          "Tudor",
          "Mkomani",
          "Ganjoni",
          "Railway Area",
          "Port Area",
          "Kizingo",
          "Ocean View"
        ]
      },
      {
        "town": "Nyali",
        "areas": [
          "Nyali Bridge",
          "Nyali Cinemax",
          "City Mall",
          "Nyali Golf Club",
          "Mombasa Cement",
          "Links Road",
          "Bombolulu",
          "Kisauni (partially)"
        ]
      },
      {
        "town": "Kisauni",
        "areas": [
          "Kisauni",
          "Bamburi",
          "Shanzu",
          "Mtwapa (bordering areas)",
          "Kisimani",
          "Mwapande",
          "Magongo",
          "Mshomoroni"
        ]
      },
      {
        "town": "Likoni",
        "areas": [
          "Likoni Ferry",
          "Likoni Town",
          "Likoni Reef",
          "Mtongwe",
          "Shika Adabu",
          "Jomvu (partially)",
          "Diani Beach (bordering areas)"
        ]
      },
      {
        "town": "Changamwe",
        "areas": [
          "Changamwe",
          "Miritini",
          "Mombasa International Airport",
          "Migadini",
          "Jomvu (partially)",
          "Kipanga"
        ]
      },
      {
        "town": "Jomvu",
        "areas": [
          "Jomvu Kuu",
          "Jomvu Mwisho",
          "Mikindani",
          "Miritini (partially)",
          "Likoni (partially)",
          "Changamwe (partially)"
        ]
      },
      {
        "town": "Mtwapa",
        "areas": [
          "Mtwapa Town Centre",
          "Mtwapa Creek",
          "Mtwapa Beach",
          "Mtwapa Mall Area",
          "Mtwapa Market Area"
        ]
      },
      {
        "town": "Bamburi",
        "areas": [
          "Bamburi Cement",
          "Bamburi Beach",
          "Bamburi Estate",
          "Kisauni (partially)"
        ]
      },
      {
        "town": "Shanzu",
        "areas": [
          "Shanzu Beach",
          "Shanzu Estate",
          "Kisauni (partially)"
        ]
      }
    ]
  },
  {
    "county": "Kisumu County",
    "towns": [
      {
        "town": "Kisumu City",
        "areas": [
          "Kisumu City Centre",
          "Milimani",
          "Kondele",
          "Manyatta",
          "Kibos",
          "Migosi",
          "Nyalenda",
          "Obunga",
          "Railways",
          "Polyview",
          "Sunset",
          "Mamboleo",
          "Riat",
          "Kisian",
          "Airport Area",
          "Industrial Area"
        ]
      },
      {
        "town": "Ahero",
        "areas": [
          "Ahero Town Centre",
          "Ahero Market",
          "Ahero Irrigation Scheme",
          "Ahero High School",
          "Ahero Catholic Church"
        ]
      },
      {
        "town": "Kisian",
        "areas": [
          "Kisian Town",
          "Kisian Market",
          "Kisian Dispensary",
          "Kisian Primary School",
          "Kisian Secondary School"
        ]
      },
      {
        "town": "Maseno",
        "areas": [
          "Maseno Town",
          "Maseno University",
          "Maseno Market",
          "Maseno Hospital",
          "Maseno School"
        ]
      },
      {
        "town": "Muhoroni",
        "areas": [
          "Muhoroni Town Centre",
          "Muhoroni Market",
          "Muhoroni Sugar Company",
          "Muhoroni Tea Estate",
          "Kipsitet (bordering area)"
        ]
      },
          {
        "town": "Nyakach",
        "areas": [
          "Nyakach Central",
          "West Nyakach",
          "East Nyakach",
          "North Nyakach",
          "South Nyakach",
          "Pap Onditi",
          "Kiboswa Market",
          "Katito Market",
          "Asao Market",
          "Soin Market"
        ]
      },
      {
        "town": "Ojola",
        "areas": [
          "Ojola Town",
          "Ojola Market",
          "Ojola Dispensary",
          "Ojola Primary School"
        ]
      },
      {
        "town": "Otonglo",
        "areas": [
          "Otonglo Town",
          "Otonglo Market",
          "Otonglo Dispensary",
          "Otonglo Primary School"
        ]
      },
      {
        "town": "Sondu",
        "areas": [
          "Sondu Town",
          "Sondu Market",
          "Sondu River",
          "Sondu Miriu Dam"
        ]
      },
      {
        "town": "Kiboswa",
        "areas": [
          "Kiboswa Town",
          "Kiboswa Market",
          "Kiboswa Dispensary",
          "Kiboswa Primary School"
        ]
      },
      {
        "town": "Katito",
        "areas": [
          "Katito Town",
          "Katito Market",
          "Katito Dispensary",
          "Katito Primary School"
        ]
      },
      {
        "town": "Asembo Bay",
        "areas": [
          "Asembo Bay",
          "Luanda Magere Shrine",
          "Usenge Beach",
          "Akala Market"
        ]
      },
      {
        "town": "Bondo",
        "areas": [
          "Bondo Town",
          "Bondo University College",
          "Usenge (bordering area)"
        ]
      },
      {
        "town": "Usenge",
        "areas": [
          "Usenge Town",
          "Usenge Beach",
          "Lake Victoria"
        ]
      }
    ]
  },
  {
    "county": "Uasin Gishu County",
    "towns": [
      {
        "town": "Eldoret",
        "areas": [
          "Eldoret Town Centre",
          "CBD",
          "Kenyatta Street",
          "Oloo Street",
          "Nandi Road",
          "Uganda Road",
          "Kisumu Road",
          "Nakuru Road",
          "Iten Road",
          "Airport Area",
          "Industrial Area",
          "West Indies",
          "Elgon View",
          "Hill School",
          "Kipchoge Keino Stadium Area",
          "Moi University (bordering areas)",
          "Annex",
          "Langas",
          "Kapsoya",
          "Kimumu",
          "Huruma",
          "Race Course",
          "Cheptiret",
          "Megun",
          "Tapsagoi",
          "Kapsaos",
          "Kesses (bordering areas)",
          "Moiben (bordering areas)",
          "Soy (bordering areas)",
          "Ainabkoi (bordering areas)"
        ]
      },
      {
        "town": "Soy",
        "areas": [
          "Soy Town Centre",
          "Soy Market",
          "Soy Hospital",
          "Soy Police Station",
          "Soy Boys High School",
          "Soy Girls High School",
          "Moi's Bridge (bordering areas)",
          "Kitale (bordering areas)",
          "Eldoret (bordering areas)",
          "Ziwa",
          "Maji Mazuri"
        ]
      },
      {
        "town": "Moiben",
        "areas": [
          "Moiben Town Centre",
          "Moiben Market",
          "Moiben Hospital",
          "Moiben Police Station",
          "Moiben Boys High School",
          "Moiben Girls High School",
          "Eldoret (bordering areas)",
          "Iten (bordering areas)",
          "Soy (bordering areas)",
          "Ainabkoi (bordering areas)",
          "Sergoit",
          "Kapchemutwa"
        ]
      },
      {
        "town": "Kesses",
        "areas": [
          "Kesses Town Centre",
          "Kesses Market",
          "Kesses Hospital",
          "Kesses Police Station",
          "Kesses Boys High School",
          "Kesses Girls High School",
          "Eldoret (bordering areas)",
          "Kericho (bordering areas)",
          "Baringo County (bordering areas)",
          "Ainabkoi (bordering areas)",
          "Chepkoilel",
          "Kipkabus"
        ]
      },
      {
          "town": "Ainabkoi",
          "areas":[
              "Ainabkoi Town",
              "Ainabkoi Market",
              "Ainabkoi Dispensary",
              "Ainabkoi Primary School",
              "Eldoret (bordering areas)",
              "Kesses (bordering areas)",
              "Kericho County (bordering areas)",
              "Baringo County (bordering areas)"
          ]
      },
      {
        "town": "Ziwa",
        "areas": [
          "Ziwa Town",
          "Ziwa Market",
          "Ziwa Dispensary",
          "Ziwa Primary School",
          "Soy (bordering areas)",
          "Eldoret (bordering areas)"
        ]
      },
      {
        "town": "Maji Mazuri",
        "areas": [
          "Maji Mazuri Town",
          "Maji Mazuri Market",
          "Maji Mazuri Dispensary",
          "Maji Mazuri Primary School",
          "Soy (bordering areas)"
        ]
      },
      {
        "town": "Sergoit",
        "areas": [
          "Sergoit Town",
          "Sergoit Market",
          "Sergoit Dispensary",
          "Sergoit Primary School",
          "Moiben (bordering areas)",
          "Eldoret (bordering areas)"
        ]
      },
      {
        "town": "Kapchemutwa",
        "areas": [
          "Kapchemutwa Town",
          "Kapchemutwa Market",
          "Kapchemutwa Dispensary",
          "Kapchemutwa Primary School",
          "Moiben (bordering areas)",
          "Iten (bordering areas)"
        ]
      },
      {
        "town": "Chepkoilel",
        "areas": [
          "Chepkoilel Town",
          "Chepkoilel Market",
          "Chepkoilel Dispensary",
          "Chepkoilel Primary School",
          "Kesses (bordering areas)"
        ]
      },
      {
        "town": "Kipkabus",
        "areas": [
          "Kipkabus Town",
          "Kipkabus Market",
          "Kipkabus Dispensary",
          "Kipkabus Primary School",
          "Kesses (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Garissa County",
    "towns": [
      {
        "town": "Garissa",
        "areas": [
          "Garissa Town Centre",
          "Garissa University College Area",
          "Garissa Provincial General Hospital Area",
          "Garissa County Headquarters Area",
          "Waberi",
          "Iftin",
          "Bull's Hotel Area",
          "Madina",
          "Simba",
          "Shanta Abaq",
          "Dadaab Refugee Camp (bordering areas)",
          "Balambala (bordering areas)",
          "Modogashe (bordering areas)",
          "Wajir (bordering areas)",
          "Mandera (bordering areas)",
          "Isiolo (bordering areas)"
        ]
      },
      {
        "town": "Dadaab",
        "areas": [
          "Dadaab Refugee Camp",
          "Hagadera",
          "Ifo",
          "Dagahaley",
          "Balambala (bordering areas)",
          "Garissa (bordering areas)"
        ]
      },
      {
        "town": "Balambala",
        "areas": [
          "Balambala Town",
          "Balambala Market",
          "Balambala Hospital",
          "Balambala Secondary School",
          "Dadaab (bordering areas)",
          "Garissa (bordering areas)"
        ]
      },
      {
        "town": "Modogashe",
        "areas": [
          "Modogashe Town",
          "Modogashe Market",
          "Modogashe Hospital",
          "Modogashe Secondary School",
          "Garissa (bordering areas)",
          "Wajir (bordering areas)",
          "Isiolo (bordering areas)"
        ]
      },
      {
        "town": "Hagadera",
        "areas": [
            "Hagadera",
            "Dadaab Refugee Camp"
          ]
      },
      {
        "town": "Ifo",
        "areas": [
            "Ifo",
            "Dadaab Refugee Camp"
          ]
      },
      {
        "town": "Dagahaley",
        "areas": [
            "Dagahaley",
            "Dadaab Refugee Camp"
          ]
      },
      {
        "town": "Liboi",
        "areas": [
          "Liboi Town",
          "Liboi Market",
          "Liboi Primary School",
          "Liboi Secondary School",
          "Somalia (bordering areas)"
        ]
      },
      {
        "town": "Ijara",
        "areas": [
          "Ijara Town",
          "Ijara Market",
          "Ijara Hospital",
          "Ijara Secondary School",
          "Somalia (bordering areas)",
          "Lamu County (bordering areas)"
        ]
      },
      {
        "town": "Masalani",
        "areas": [
          "Masalani Town",
          "Masalani Market",
          "Masalani Dispensary",
          "Masalani Primary School",
          "Tana River County (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Isiolo County",
    "towns": [
      {
        "town": "Isiolo Town",
        "areas": [
          "Isiolo Town Centre",
          "Isiolo Airport Area",
          "Isiolo County Headquarters Area",
          "Isiolo District Hospital Area",
          "Isiolo Barracks Area",
          "Isiolo Polytechnic Area",
          "Kulamawe",
          "Kiwanja",
          "Ngare Ndare",
          "Oldonyiro"
        ]
      },
      {
        "town": "Merti",
        "areas": [
          "Merti Town",
          "Merti Market",
          "Merti Dispensary",
          "Merti Primary School",
          "Merti Secondary School"
        ]
      },
      {
        "town": "Garba Tula",
        "areas": [
          "Garba Tula Town",
          "Garba Tula Market",
          "Garba Tula Dispensary",
          "Garba Tula Primary School",
          "Garba Tula Secondary School"
        ]
      },
      {
        "town": "Sericho",
        "areas": [
          "Sericho Town",
          "Sericho Market",
          "Sericho Dispensary",
          "Sericho Primary School"
        ]
      },
      {
        "town": "Kinna",
        "areas": [
          "Kinna Town",
          "Kinna Market",
          "Kinna Dispensary",
          "Kinna Primary School"
        ]
      },
      {
        "town": "Modogashe",
        "areas": [
          "Modogashe Town",
          "Modogashe Market",
          "Modogashe Dispensary",
          "Modogashe Primary School"
        ]
      },
      {
        "town": "Ewaso Nyiro",
        "areas": [
          "Ewaso Nyiro Town",
          "Ewaso Nyiro Market",
          "Ewaso Nyiro Dispensary",
          "Ewaso Nyiro Primary School"
        ]
      },
      {
        "town": "Archer's Post",
        "areas": [
          "Archer's Post Town",
          "Archer's Post Market",
          "Archer's Post Dispensary",
          "Archer's Post Primary School"
        ]
      }
    ]
  },
  {
    "county": "Nyeri County",
    "towns": [
      {
        "town": "Nyeri",
        "areas": [
          "Nyeri Town Centre",
          "Nyeri National Polytechnic Area",
          "Nyeri County Headquarters Area",
          "Nyeri Provincial General Hospital Area",
          "Dedan Kimathi University of Technology (DeKUT) Area",
          "Kiganjo",
          "Ruring'u",
          "King'ong'o",
          "Skuta",
          "Ihururu",
          "Mathira",
          "Mukurweini",
          "Othaya",
          "Tetu",
          "Kieni",
          "Mweiga",
          "Chaka",
          "Endarasha"
        ]
      },
      {
        "town": "Karatina",
        "areas": [
          "Karatina Town Centre",
          "Karatina Market",
          "Karatina Bus Park",
          "Karatina Railway Station",
          "Karatina Hospital",
          "Karatina Police Station",
          "Karatina University College",
          "Kagumo",
          "Kimunyu",
          "Gakindu",
          "Iriaini"
        ]
      },
      {
        "town": "Mukurweini",
        "areas": [
          "Mukurweini Town Centre",
          "Mukurweini Market",
          "Mukurweini Hospital",
          "Mukurweini Police Station",
          "Mukurweini Boys High School",
          "Mukurweini Girls High School",
          "Githi",
          "Gitero",
          "Kihumo",
          "Kiamwangi",
          "Rware"
        ]
      },
      {
        "town": "Othaya",
        "areas": [
          "Othaya Town Centre",
          "Othaya Market",
          "Othaya Hospital",
          "Othaya Police Station",
          "Othaya Boys High School",
          "Othaya Girls High School",
          "Mahiga",
          "Kianganda",
          "Kiraini",
          "Kanyange"
        ]
      },
      {
        "town": "Tetu",
        "areas": [
          "Tetu Town",
          "Tetu Market",
          "Tetu Hospital",
          "Tetu Police Station",
          "Tetu Boys High School",
          "Tetu Girls High School",
          "Gatundu",
          "Githunguri",
          "Ithendu",
          "Kamwangi"
        ]
      },
      {
        "town": "Kieni",
        "areas": [
          "Kieni East",
          "Kieni West",
          "Kieni North",
          "Kieni South",
          "Naro Moru",
          "Sirimon",
          "Timau",
          "Chumvi",
          "Endarasha",
          "Mweiga"
        ]
      },
      {
        "town": "Mweiga",
        "areas": [
          "Mweiga Town",
          "Mweiga Market",
          "Mweiga Hospital",
          "Mweiga Police Station",
          "Mweiga Boys High School",
          "Mweiga Girls High School",
          "Nyeri National Park",
          "Aberdare National Park",
          "Kimathi University College of Agriculture and Technology"
        ]
      },
      {
        "town": "Chaka",
        "areas": [
          "Chaka Market",
          "Chaka Town",
          "Chaka Hospital",
          "Chaka Police Station",
          "Chaka Boys High School",
          "Chaka Girls High School"
        ]
      },
      {
        "town": "Endarasha",
        "areas": [
          "Endarasha Town",
          "Endarasha Market",
          "Endarasha Hospital",
          "Endarasha Police Station",
          "Endarasha Boys High School",
          "Endarasha Girls High School"
        ]
      },
      {
        "town": "Ihururu",
        "areas": [
          "Ihururu Town",
          "Ihururu Market",
          "Ihururu Hospital",
          "Ihururu Police Station",
          "Ihururu Boys High School",
          "Ihururu Girls High School"
        ]
      },
      {
        "town": "Mathira",
        "areas": [
          "Mathira East",
          "Mathira West",
          "Mathira North",
          "Mathira South",
          "Karura",
          "Kiamahiga",
          "Kanyagia",
          "Kihoya",
          "Muthiga"
        ]
      },
      {
        "town": "Rumuruti"
      },
      {
        "town": "Sirimon"
      },
      {
        "town": "Timau"
      },
      {
        "town": "Naro Moru"
      }
  
    ]
  },
  {
    "county": "Tharaka Nithi County",
    "towns": [
      {
        "town": "Chuka",
        "areas": [
          "Chuka Town Centre",
          "Chuka Market",
          "Chuka County Referral Hospital",
          "Chuka University",
          "Chuka Police Station",
          "Nturiri",
          "Kaanwa",
          "Gatondo",
          "Marimanti (bordering areas)",
          "Embu County (bordering areas)",
          "Meru County (bordering areas)"
        ]
      },
      {
        "town": "Marimanti",
        "areas": [
          "Marimanti Town Centre",
          "Marimanti Market",
          "Marimanti Hospital",
          "Marimanti Police Station",
          "Tharaka",
          "Tharaka South",
          "Tharaka North",
          "Chuka (bordering areas)",
          "Kitui County (bordering areas)"
        ]
      },
      {
        "town": "Kathwana",
        "areas": [
          "Kathwana Town",
          "Kathwana Market",
          "Kathwana Dispensary",
          "Gatunga",
          "Mukindu"
        ]
      },
      {
        "town": "Gatunga",
        "areas": [
          "Gatunga Town",
          "Gatunga Market",
          "Gatunga Dispensary",
          "Kathwana (partially)"
        ]
      },
      {
        "town": "Mukindu",
        "areas": [
          "Mukindu Town",
          "Mukindu Market",
          "Mukindu Dispensary",
          "Kathwana (partially)"
        ]
      },
          {
        "town": "Ikamari",
        "areas": [
          "Ikamari Town",
          "Ikamari Market",
          "Ikamari Dispensary"
        ]
      },
          {
        "town": "Keria",
        "areas": [
          "Keria Town",
          "Keria Market",
          "Keria Dispensary"
        ]
      },
          {
        "town": "Kirumi",
        "areas": [
          "Kirumi Town",
          "Kirumi Market",
          "Kirumi Dispensary"
        ]
      },
          {
        "town": "Muthambi",
        "areas": [
          "Muthambi Town",
          "Muthambi Market",
          "Muthambi Dispensary"
        ]
      },
          {
        "town": "Mwimbi",
        "areas": [
          "Mwimbi Town",
          "Mwimbi Market",
          "Mwimbi Dispensary"
        ]
      },
          {
        "town": "Ndagani",
        "areas": [
          "Ndagani Town",
          "Ndagani Market",
          "Ndagani Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Baringo County",
    "towns": [
      {
        "town": "Kabarnet",
        "areas": [
          "Kabarnet Town Centre",
          "Kabarnet Market",
          "Kabarnet Hospital",
          "Kabarnet Police Station",
          "Kabarnet Showground",
          "Baringo County Headquarters",
          "Kipchoge Keino Stadium",
          "Kapropita",
          "Chepkorio",
          "Sacho",
          "Tenges",
          "Baringo North",
          "Baringo Central",
          "Baringo South"
        ]
      },
      {
        "town": "Eldama Ravine",
        "areas": [
          "Eldama Ravine Town Centre",
          "Eldama Ravine Market",
          "Eldama Ravine Hospital",
          "Eldama Ravine Police Station",
          "Eldama Ravine Bus Park",
          "Rongai (bordering areas)",
          "Mogotio (bordering areas)",
          "Koibatek",
          "Lembus Kipsigis",
          "Emining"
        ]
      },
      {
        "town": "Mogotio",
        "areas": [
          "Mogotio Town Centre",
          "Mogotio Market",
          "Mogotio Hospital",
          "Mogotio Police Station",
          "Eldama Ravine (bordering areas)",
          "Nakuru County (bordering areas)",
          "Koibatek",
          "Lembus Kipsigis"
        ]
      },
      {
        "town": "Marigat",
        "areas": [
          "Marigat Town Centre",
          "Marigat Market",
          "Marigat Hospital",
          "Marigat Police Station",
          "Lake Baringo",
          "Ruko Conservancy",
          "Tiaty",
          "Baringo South"
        ]
      },
      {
        "town": "Chemolingot",
        "areas": [
          "Chemolingot Town",
          "Chemolingot Market",
          "Chemolingot Dispensary",
          "Tiaty",
          "Baringo North"
        ]
      },
      {
        "town": "Tangulbei",
        "areas": [
          "Tangulbei Town",
          "Tangulbei Market",
          "Tangulbei Dispensary",
          "Tiaty",
          "Baringo North"
        ]
      },
      {
        "town": "Kolosia",
        "areas": [
          "Kolosia Town",
          "Kolosia Market",
          "Kolosia Dispensary",
          "Tiaty",
          "Baringo North"
        ]
      },
      {
        "town": "Lokori",
        "areas": [
          "Lokori Town",
          "Lokori Market",
          "Lokori Dispensary",
          "Tiaty",
          "Baringo North"
        ]
      },
      {
        "town": "Nginyang",
        "areas": [
          "Nginyang Town",
          "Nginyang Market",
          "Nginyang Dispensary",
          "Tiaty",
          "Baringo North"
        ]
      },
      {
        "town": "Kampi ya Moto",
        "areas": [
          "Kampi ya Moto Town",
          "Kampi ya Moto Market",
          "Kampi ya Moto Dispensary",
          "Baringo Central"
        ]
      },
      {
        "town": "Sacho",
        "areas": [
          "Sacho Town",
          "Sacho Market",
          "Sacho Dispensary",
          "Baringo Central"
        ]
      },
          {
        "town": "Tenges",
        "areas": [
          "Tenges Town",
          "Tenges Market",
          "Tenges Dispensary",
          "Baringo Central"
        ]
      },
      {
        "town": "Kapropita",
        "areas": [
          "Kapropita Town",
          "Kapropita Market",
          "Kapropita Dispensary",
          "Baringo Central"
        ]
      },
          {
        "town": "Chepkorio",
        "areas": [
          "Chepkorio Town",
          "Chepkorio Market",
          "Chepkorio Dispensary",
          "Baringo Central"
        ]
      },
      {
        "town": "Emning",
        "areas": [
          "Emining Town",
          "Emining Market",
          "Emining Dispensary",
          "Koibatek"
        ]
      },
          {
        "town": "Lembus Kipsigis",
        "areas": [
          "Lembus Kipsigis Area",
          "Koibatek"
        ]
      }
    ]
  },
  {
    "county": "Elgeyo Marakwet County",
    "towns": [
      {
        "town": "Iten",
        "areas": [
          "Iten Town Centre",
          "Kapchemutwa",
          "Keiyo North",
          "Keiyo South",
          "Elgeyo Marakwet County Headquarters Area",
          "Iten/Tambach Road",
          "Eldoret-Iten Road",
          "Chepkoilel",
          "Kessup",
          "Embobut",
          "Sergoit Hill",
          "Kerio Valley (bordering areas)"
        ]
      },
      {
        "town": "Eldoret (bordering areas)",
        "areas": [
          "Eldoret Town Centre",
          "Langas",
          "Huruma",
          "Annex",
          "Pioneer",
          "Kipkenyo",
          "Kapsoya",
          "Race Course",
          "Industrial Area",
          "Eldoret International Airport Area",
          "Moi University (Main Campus) Area",
          "University of Eldoret Area",
          "Rift Valley Technical Training Institute Area",
          "Eldoret Polytechnic Area",
          "Eldoret National Polytechnic Area",
          "Uasin Gishu County Headquarters Area",
          "Eldoret-Nakuru Highway",
          "Eldoret-Kitale Highway",
          "Eldoret-Iten Road",
          "Eldoret-Kapsabet Road",
          "Eldoret-Kisumu Road",
          "Eldoret-Lodwar Road"
        ]
      },
      {
        "town": "Tambach",
        "areas": [
          "Tambach Town",
          "Tambach Market",
          "Tambach Hospital",
          "Tambach Police Station",
          "Tambach Teachers Training College",
          "Iten (bordering areas)",
          "Keiyo North (partially)",
          "Keiyo South (partially)"
        ]
      },
      {
        "town": "Chepkorio",
        "areas": [
          "Chepkorio Town",
          "Chepkorio Market",
          "Chepkorio Hospital",
          "Chepkorio Police Station",
          "Keiyo North (partially)"
        ]
      },
      {
        "town": "Kapcherop",
        "areas": [
          "Kapcherop Town",
          "Kapcherop Market",
          "Kapcherop Dispensary",
          "Kapcherop Primary School",
          "Marakwet East (partially)"
        ]
      },
      {
        "town": "Kapsait",
        "areas": [
          "Kapsait Town",
          "Kapsait Market",
          "Kapsait Dispensary",
          "Kapsait Primary School",
          "Marakwet West (partially)"
        ]
      },
      {
        "town": "Lelach",
        "areas": [
          "Lelach Town",
          "Lelach Market",
          "Lelach Dispensary",
          "Lelach Primary School",
          "Keiyo South (partially)"
        ]
      },
      {
        "town": "Moi University (Chepkoilel Campus) Area",
        "areas": [
          "Chepkoilel",
          "Iten (bordering areas)",
          "Eldoret (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Nandi County",
    "region": "Rift Valley",
    "towns": [
      {
        "town": "Kapsabet",
        "areas": [
          "Kapsabet Town Centre",
          "Kapsabet Market",
          "Kapsabet County Referral Hospital",
          "Kapsabet Showground",
          "Kapsabet University",
          "Chepterwai",
          "Kimeloi",
          "Kipkaren",
          "Kiptenden",
          "Kapsabet Forest"
        ]
      },
      {
        "town": "Eldoret (partially)",
        "areas": [
          "Eldoret Town Centre",
          "Iten Road",
          "Nakuru Road",
          "Kisumu Road",
          "Uganda Road",
          "Kipchoge Keino Stadium",
          "Moi University",
          "Eldoret International Airport",
          "Langas",
          "Huruma",
          "Annex",
          "Kimumu",
          "Kapsoya",
          "Race Course",
          "Elgon View",
          "Hill School",
          "Webuye (bordering areas)",
          "Kitale (bordering areas)",
          "Kabarnet (bordering areas)",
          "Iten (bordering areas)"
        ]
      },
      {
        "town": "Mosoriot",
        "areas": [
          "Mosoriot Town Centre",
          "Mosoriot Market",
          "Mosoriot Sub-County Hospital",
          "Mosoriot Tea Factory",
          "Kipchoge Farm",
          "Kaboi",
          "Kipsigak",
          "Tindiret"
        ]
      },
      {
        "town": "Chemelil",
        "areas": [
          "Chemelil Town",
          "Chemelil Market",
          "Chemelil Sugar Company",
          "Chemelil Railway Station",
          "Kibigori",
          "Songhor",
          "Muhoroni (bordering areas)"
        ]
      },
      {
        "town": "Lessos",
        "areas": [
          "Lessos Town Centre",
          "Lessos Market",
          "Lessos Railway Station",
          "Lessos Tea Factory",
          "Kapsabet (bordering areas)",
          "Nandi Hills (bordering areas)"
        ]
      },
      {
        "town": "Nandi Hills",
        "areas": [
          "Nandi Hills Town Centre",
          "Nandi Hills Market",
          "Nandi Hills Hospital",
          "Nandi Hills Tea Estates",
          "Koiyo",
          "Songor",
          "Kipkurui",
          "Lessos (bordering areas)",
          "Kapsabet (bordering areas)"
        ]
      },
      {
        "town": "Iten (partially)",
        "areas": [
          "Iten Town Centre",
          "Iten Market",
          "Iten Viewpoint",
          "Kerio Valley",
          "Tambach",
          "Kapsabet (bordering areas)",
          "Eldoret (bordering areas)"
        ]
      },
      {
        "town": "Kabarnet (partially)",
        "areas": [
          "Kabarnet Town Centre",
          "Kabarnet Market",
          "Kabarnet Hospital",
          "Baringo County Headquarters",
          "Kapsabet (bordering areas)",
          "Eldoret (bordering areas)"
        ]
      },
      {
        "town": "Kipkarren Salient",
        "areas": [
          "Kipkarren Salient",
          "Chepkumia",
          "Kapsabet Forest",
          "Uasin Gishu County (bordering areas)"
        ]
      },
      {
        "town": "Kipsigak",
        "areas": [
          "Kipsigak Town",
          "Kipsigak Market",
          "Kipsigak Tea Factory",
          "Mosoriot (bordering areas)"
        ]
      },
      {
        "town": "Tindiret",
        "areas": [
          "Tindiret Town",
          "Tindiret Market",
          "Tindiret Tea Factory",
          "Mosoriot (bordering areas)"
        ]
      },
      {
        "town": "Kaboi",
        "areas": [
          "Kaboi Town",
          "Kaboi Market",
          "Kaboi Dispensary",
          "Mosoriot (bordering areas)"
        ]
      },
      {
        "town": "Kimeloi",
        "areas": [
          "Kimeloi Town",
          "Kimeloi Market",
          "Kimeloi Dispensary",
          "Kapsabet (bordering areas)"
        ]
      },
      {
        "town": "Kipkaren",
        "areas": [
          "Kipkaren Town",
          "Kipkaren Market",
          "Kipkaren Dispensary",
          "Kapsabet (bordering areas)"
        ]
      },
      {
        "town": "Kiptenden",
        "areas": [
          "Kiptenden Town",
          "Kiptenden Market",
          "Kiptenden Dispensary",
          "Kapsabet (bordering areas)"
        ]
      },
      {
        "town": "Chepterwai",
        "areas": [
          "Chepterwai Town",
          "Chepterwai Market",
          "Chepterwai Dispensary",
          "Kapsabet (bordering areas)"
        ]
      },
      {
        "town": "Kibigori",
        "areas": [
          "Kibigori Town",
          "Kibigori Market",
          "Kibigori Railway Station",
          "Chemelil (bordering areas)"
        ]
      },
      {
        "town": "Songhor",
        "areas": [
          "Songhor Town",
          "Songhor Market",
          "Songhor Tea Factory",
          "Chemelil (bordering areas)",
          "Nandi Hills (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Trans Nzoia County",
    "towns": [
      {
        "town": "Kitale",
        "areas": [
          "Kitale Town Centre",
          "Kenyatta Street Area",
          "Trans Nzoia County Headquarters Area",
          "Kitale National Polytechnic Area",
          "Kitale Referral Hospital Area",
          "Industrial Area",
          "Shimo la Tewa",
          "Mitume",
          "Kibomet",
          "Tuwani",
          "Sinyerere",
          "Sirende"
        ]
      },
      {
        "town": "Webuye",
        "areas": [
          "Webuye Town Centre",
          "Webuye Market",
          "Webuye Hospital",
          "Webuye Railway Station",
          "Webuye Bus Park",
          "Misikhu",
          "Bokoli",
          "Naitiri",
          "Bungoma County (bordering areas)"
        ]
      },
      {
        "town": "Kimilili",
        "areas": [
          "Kimilili Town Centre",
          "Kimilili Market",
          "Kimilili Sub-County Hospital",
          "Kamukuywa",
          "Misikhu",
          "Chwele",
          "Kibingei",
          "Naitiri",
          "Bungoma County (bordering areas)"
        ]
      },
      {
        "town": "Endebess",
        "areas": [
          "Endebess Town",
          "Endebess Market",
          "Endebess Hospital",
          "Endebess Police Station",
          "Soy (bordering areas)"
        ]
      },
      {
        "town": "Sinyerere",
        "areas": [
          "Sinyerere Centre",
          "Sinyerere Market",
          "Sinyerere Primary School"
        ]
      },
      {
        "town": "Sirende",
        "areas": [
          "Sirende Centre",
          "Sirende Market",
          "Sirende Primary School"
        ]
      },
      {
        "town": "Makunga",
        "areas": [
          "Makunga Centre",
          "Makunga Market",
          "Makunga Primary School"
        ]
      },
      {
        "town": "Chepchoina",
        "areas": [
          "Chepchoina Centre",
          "Chepchoina Market",
          "Chepchoina Primary School"
        ]
      },
      {
        "town": "Kaplamai",
        "areas": [
          "Kaplamai Centre",
          "Kaplamai Market",
          "Kaplamai Primary School"
        ]
      },
          {
        "town": "Kapsakwony",
        "areas": [
          "Kapsakwony Centre",
          "Kapsakwony Market",
          "Kapsakwony Hospital",
          "Bungoma County (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "West Pokot County",
    "towns": [
      {
        "town": "Kapenguria",
        "areas": [
          "Kapenguria Town Centre",
          "Kapenguria Market",
          "Kapenguria County Hospital",
          "Kapenguria Police Station",
          "Kapenguria Boys High School",
          "Kapenguria Girls High School",
          "Chepareria",
          "Makutano",
          "Kapsakwony (bordering areas)",
          "Kitale (bordering areas)"
        ]
      },
      {
        "town": "Chepareria",
        "areas": [
          "Chepareria Town Centre",
          "Chepareria Market",
          "Chepareria Hospital",
          "Chepareria Police Station",
          "Chepareria Boys High School",
          "Chepareria Girls High School",
          "Kapenguria (bordering areas)",
          "Sigor",
          "Alale"
        ]
      },
      {
        "town": "Sigor",
        "areas": [
          "Sigor Town Centre",
          "Sigor Market",
          "Sigor Hospital",
          "Sigor Police Station",
          "Sigor Boys High School",
          "Sigor Girls High School",
          "Chepareria (bordering areas)",
          "Alale",
          "Ortum"
        ]
      },
      {
        "town": "Alale",
        "areas": [
          "Alale Town Centre",
          "Alale Market",
          "Alale Hospital",
          "Alale Police Station",
          "Alale Boys High School",
          "Alale Girls High School",
          "Chepareria (bordering areas)",
          "Sigor (bordering areas)",
          "Kacheliba"
        ]
      },
      {
        "town": "Kacheliba",
        "areas": [
          "Kacheliba Town Centre",
          "Kacheliba Market",
          "Kacheliba Hospital",
          "Kacheliba Police Station",
          "Kacheliba Boys High School",
          "Kacheliba Girls High School",
          "Alale (bordering areas)",
          "Lokichogio (bordering areas)"
        ]
      },
      {
        "town": "Ortum",
        "areas": [
          "Ortum Town Centre",
          "Ortum Market",
          "Ortum Hospital",
          "Ortum Police Station",
          "Ortum Boys High School",
          "Ortum Girls High School",
          "Sigor (bordering areas)",
          "Turkana County (bordering areas)"
        ]
      },
          {
        "town": "Makutano",
        "areas": [
          "Makutano Town",
          "Makutano Market",
          "Makutano Shopping Centre",
          "Kapenguria (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Busia County",
    "towns": [
      {
        "town": "Busia",
        "areas": [
          "Busia Town Centre",
          "Busia Border Point",
          "Busia Airstrip",
          "Busia County Referral Hospital",
          "Busia National Polytechnic",
          "Marachi",
          "Nambale",
          "Bumala",
          "Funyula",
          "Sio Port",
          "Budalangi"
        ]
      },
      {
        "town": "Malaba",
        "areas": [
          "Malaba Town Centre",
          "Malaba Border Point (Kenya-Uganda)",
          "Malaba Market",
          "Malaba Hospital",
          "Malaba Police Station"
        ]
      },
      {
        "town": "Bumala",
        "areas": [
          "Bumala Town Centre",
          "Bumala Market",
          "Bumala Hospital",
          "Bumala Police Station"
        ]
      },
      {
        "town": "Funyula",
        "areas": [
          "Funyula Town Centre",
          "Funyula Market",
          "Funyula Hospital",
          "Funyula Police Station"
        ]
      },
      {
        "town": "Nambale",
        "areas": [
          "Nambale Town Centre",
          "Nambale Market",
          "Nambale Hospital",
          "Nambale Police Station"
        ]
      },
      {
        "town": "Sio Port",
        "areas": [
          "Sio Port Town Centre",
          "Sio Port Market",
          "Sio Port",
          "Lake Victoria"
        ]
      },
      {
        "town": "Budalangi",
        "areas": [
          "Budalangi Town Centre",
          "Budalangi Market",
          "Budalangi Flood Control Project",
          "Lake Victoria"
        ]
      },
      {
        "town": "Angoromo",
        "areas": [
          "Angoromo Town",
          "Angoromo Market",
          "Angoromo Dispensary"
        ]
      },
      {
        "town": "Asinge",
        "areas": [
          "Asinge Town",
          "Asinge Market",
          "Asinge Dispensary"
        ]
      },
      {
        "town": "Busia (Uganda)",
        "areas": [
          "Busia (Uganda) Town Centre",
          "Busia (Uganda) Border Point",
          "Busia (Uganda) Market"
        ]
      }
    ]
  },
  {
    "county": "Vihiga County",
    "towns": [
      {
        "town": "Vihiga",
        "areas": [
          "Vihiga Town Centre",
          "Vihiga County Headquarters",
          "Vihiga Referral Hospital",
          "Vihiga Market",
          "Vihiga Boys High School",
          "Vihiga Girls High School",
          "Mbale",
          "Luanda",
          "Kapsabet (bordering areas)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Luanda",
        "areas": [
          "Luanda Town Centre",
          "Luanda Market",
          "Luanda Hospital",
          "Luanda Boys High School",
          "Luanda Girls High School",
          "Vihiga (partially)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Mbale",
        "areas": [
          "Mbale Town Centre",
          "Mbale Market",
          "Mbale Hospital",
          "Mbale Boys High School",
          "Mbale Girls High School",
          "Vihiga (partially)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Hamisi",
        "areas": [
          "Hamisi Town",
          "Hamisi Market",
          "Hamisi Hospital",
          "Hamisi Boys High School",
          "Hamisi Girls High School",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Shamakhokho",
        "areas": [
          "Shamakhokho Town",
          "Shamakhokho Market",
          "Shamakhokho Hospital",
          "Shamakhokho Boys High School",
          "Shamakhokho Girls High School",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Emuhaya",
        "areas": [
          "Emuhaya Town",
          "Emuhaya Market",
          "Emuhaya Hospital",
          "Emuhaya Boys High School",
          "Emuhaya Girls High School",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Kapsabet",
        "areas": [
          "Kapsabet Town Centre",
          "Kapsabet Market",
          "Kapsabet County Referral Hospital",
          "Kapsabet Boys High School",
          "Kapsabet Girls High School",
          "Nandi County (bordering areas)"
        ]
      },
      {
        "town": "Majengo",
        "areas": [
          "Majengo Town",
          "Majengo Market",
          "Majengo Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Wodanga",
        "areas": [
          "Wodanga Town",
          "Wodanga Market",
          "Wodanga Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Jebrok",
        "areas": [
          "Jebrok Town",
          "Jebrok Market",
          "Jebrok Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Ivogoyi",
        "areas": [
          "Ivogoyi Town",
          "Ivogoyi Market",
          "Ivogoyi Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Lwanda",
        "areas": [
          "Lwanda Town",
          "Lwanda Market",
          "Lwanda Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Mungoma",
        "areas": [
          "Mungoma Town",
          "Mungoma Market",
          "Mungoma Dispensary",
          "Vihiga (Partially)"
        ]
      },
      {
        "town": "Nandi Hills",
        "areas": [
          "Nandi Hills Town",
          "Nandi Hills Market",
          "Nandi Hills Hospital",
          "Nandi Hills Tea Estates",
          "Nandi County (Partially)"
        ]
      }
    ]
  },
  {
    "county": "Kakamega County",
    "towns": [
      {
        "town": "Kakamega",
        "areas": [
          "Kakamega Town Centre",
          "Milimani",
          "Shibuli",
          "Mahiakalo",
          "Likuyani",
          "Lurambi",
          "Shinyalu",
          "Ikolomani",
          "Khayega",
          "Masinde Muliro University of Science and Technology (MMUST) Area",
          "Kakamega Forest"
        ]
      },
      {
        "town": "Mumias",
        "areas": [
          "Mumias Town Centre",
          "Mumias Sugar Company",
          "Mumias East",
          "Mumias West",
          "Matungu",
          "Butere (bordering areas)"
        ]
      },
      {
        "town": "Butere",
        "areas": [
          "Butere Town Centre",
          "Butere Market",
          "Butere Hospital",
          "Butere Police Station",
          "Shibembe",
          "Marama",
          "Emuhaya (bordering areas)",
          "Mumias (bordering areas)"
        ]
      },
      {
        "town": "Khayega",
        "areas": [
          "Khayega Town Centre",
          "Khayega Market",
          "Khayega Hospital",
          "Khayega Police Station",
          "Shinyalu (bordering areas)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Shinyalu",
        "areas": [
          "Shinyalu Town Centre",
          "Shinyalu Market",
          "Shinyalu Hospital",
          "Shinyalu Police Station",
          "Khayega (bordering areas)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Malava",
        "areas": [
          "Malava Town Centre",
          "Malava Market",
          "Malava Hospital",
          "Malava Police Station",
          "Lugari (bordering areas)",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Lugari",
        "areas": [
          "Lugari Town Centre",
          "Lugari Market",
          "Lugari Hospital",
          "Lugari Police Station",
          "Malava (bordering areas)",
          "Trans Nzoia County (bordering areas)"
        ]
      },
      {
        "town": "Ikolomani",
        "areas": [
          "Ikolomani Town Centre",
          "Ikolomani Market",
          "Ikolomani Hospital",
          "Ikolomani Police Station",
          "Kakamega (bordering areas)"
        ]
      },
      {
        "town": "Lurambi",
        "areas": [
          "Lurambi Town Centre",
          "Lurambi Market",
          "Lurambi Hospital",
          "Lurambi Police Station",
          "Kakamega (bordering areas)"
        ]
      },
          {
        "town": "Matungu",
        "areas": [
          "Matungu Town Centre",
          "Matungu Market",
          "Matungu Hospital",
          "Matungu Police Station",
          "Mumias(bordering areas)"
        ]
      },
          {
        "town": "Navakholo",
        "areas": [
          "Navakholo Town",
          "Navakholo Market",
          "Navakholo Hospital",
          "Navakholo Police Station",
          "Lugari(bordering areas)"
        ]
      }
  
    ]
  },
  {
    "county": "Kisii County",
    "towns": [
      {
        "town": "Kisii Town",
        "areas": [
          "Kisii Town Centre",
          "Kisii University Area",
          "Kisii Teaching and Referral Hospital Area",
          "Kisii County Headquarters Area",
          "Kisii Agricultural College Area",
          "Nyanchwa",
          "Jogoo",
          "Mlimani",
          "Daraja Mbili",
          "Nyabururu",
          "Nyamataro"
        ]
      },
      {
        "town": "Suneka",
        "areas": [
          "Suneka Town Centre",
          "Suneka Market",
          "Suneka Hospital",
          "Suneka Police Station"
        ]
      },
      {
        "town": "Nyamache",
        "areas": [
          "Nyamache Town Centre",
          "Nyamache Market",
          "Nyamache Hospital",
          "Nyamache Police Station"
        ]
      },
      {
        "town": "Ogembo",
        "areas": [
          "Ogembo Town Centre",
          "Ogembo Market",
          "Ogembo Hospital",
          "Ogembo Police Station"
        ]
      },
      {
        "town": "Isebania",
        "areas": [
          "Isebania Town Centre",
          "Isebania Border Point (Kenya-Tanzania)",
          "Isebania Market",
          "Isebania Hospital"
        ]
      },
      {
        "town": "Keumbu",
        "areas": [
          "Keumbu Town Centre",
          "Keumbu Market",
          "Keumbu Hospital"
        ]
      },
      {
        "town": "Marani",
        "areas": [
          "Marani Town Centre",
          "Marani Market",
          "Marani Hospital"
        ]
      },
      {
        "town": "Masimba",
        "areas": [
          "Masimba Town Centre",
          "Masimba Market",
          "Masimba Hospital"
        ]
      },
      {
        "town": "Manga",
        "areas": [
          "Manga Town Centre",
          "Manga Market",
          "Manga Hospital"
        ]
      },
      {
        "town": "Gesusu",
        "areas": [
          "Gesusu Town Centre",
          "Gesusu Market",
          "Gesusu Hospital"
        ]
      },
      {
        "town": "Etago",
        "areas": [
          "Etago Town Centre",
          "Etago Market",
          "Etago Hospital"
        ]
      },
          {
        "town": "Tabaka",
        "areas": [
          "Tabaka Town Centre",
          "Tabaka Market",
          "Tabaka Hospital"
        ]
      },
          {
        "town": "Kenyerere",
        "areas": [
          "Kenyerere Town Centre",
          "Kenyerere Market",
          "Kenyerere Hospital"
        ]
      },
          {
        "town": "Riakura",
        "areas": [
          "Riakura Town Centre",
          "Riakura Market",
          "Riakura Hospital"
        ]
      },
          {
        "town": "Omogoncho",
        "areas": [
          "Omogoncho Town Centre",
          "Omogoncho Market",
          "Omogoncho Hospital"
        ]
      }
    ]
  },
  {
    "county": "Nyamira County",
    "towns": [
      {
        "town": "Nyamira Town",
        "areas": [
          "Nyamira Town Centre",
          "Nyamira Market",
          "Nyamira County Referral Hospital",
          "Nyamira Police Station",
          "Nyamira Post Office",
          "Nyamira Guesthouse",
          "Nyamira Bus Park",
          "Ekerenyo",
          "Ikonge",
          "Kemera",
          "Gesima"
        ]
      },
      {
        "town": "Keroka",
        "areas": [
          "Keroka Town Centre",
          "Keroka Market",
          "Keroka Sub-County Hospital",
          "Keroka Police Station",
          "Keroka Bus Park",
          "Nyagacho",
          "Nyangusu",
          "Riosiri",
          "Bokeria"
        ]
      },
      {
        "town": "Ikonge",
        "areas": [
          "Ikonge Market",
          "Ikonge Town",
          "Ikonge Dispensary",
          "Ikonge Primary School",
          "Ikonge Secondary School"
        ]
      },
      {
        "town": "Kemera",
        "areas": [
          "Kemera Market",
          "Kemera Town",
          "Kemera Dispensary",
          "Kemera Primary School",
          "Kemera Secondary School"
        ]
      },
      {
        "town": "Gesima",
        "areas": [
          "Gesima Market",
          "Gesima Town",
          "Gesima Dispensary",
          "Gesima Primary School",
          "Gesima Secondary School"
        ]
      },
          {
        "town": "Ekerenyo",
        "areas": [
          "Ekerenyo Market",
          "Ekerenyo Town",
          "Ekerenyo Dispensary",
          "Ekerenyo Primary School",
          "Ekerenyo Secondary School"
        ]
      },
      {
        "town": "Nyagacho",
        "areas": [
          "Nyagacho Market",
          "Nyagacho Town",
          "Nyagacho Dispensary",
          "Nyagacho Primary School"
        ]
      },
      {
        "town": "Nyangusu",
        "areas": [
          "Nyangusu Market",
          "Nyangusu Town",
          "Nyangusu Dispensary",
          "Nyangusu Primary School"
        ]
      },
      {
        "town": "Riosiri",
        "areas": [
          "Riosiri Market",
          "Riosiri Town",
          "Riosiri Dispensary",
          "Riosiri Primary School"
        ]
      },
      {
        "town": "Bokeria",
        "areas": [
          "Bokeria Market",
          "Bokeria Town",
          "Bokeria Dispensary",
          "Bokeria Primary School"
        ]
      }
  
    ]
  },
  {
    "county": "Siaya County",
    "towns": [
      {
        "town": "Siaya",
        "areas": [
          "Siaya Town Centre",
          "Siaya County Referral Hospital",
          "Siaya National Polytechnic",
          "Siaya Institute of Technology",
          "Siaya Agricultural Showground",
          "Alego Usonga",
          "Gem",
          "Rarieda",
          "Ugenya",
          "Ugunja"
        ]
      },
      {
        "town": "Bondo",
        "areas": [
          "Bondo Town Centre",
          "Bondo Market",
          "Bondo Sub-County Hospital",
          "Jaramogi Oginga Odinga University of Science and Technology (JOOUST) Area",
          "Usenge",
          "Asembo",
          "Sakwa",
          "Yimbo"
        ]
      },
      {
        "town": "Ugunja",
        "areas": [
          "Ugunja Town Centre",
          "Ugunja Market",
          "Ugunja Sub-County Hospital",
          "Ugunja Polytechnic",
          "Ugunja-Siaya Road",
          "Ugunja-Kisumu Road",
          "Ugunja-Busia Road"
        ]
      },
      {
        "town": "Usenge",
        "areas": [
          "Usenge Town Centre",
          "Usenge Market",
          "Usenge Beach",
          "Usenge Port",
          "Lake Victoria",
          "Bondo (partially)",
          "Siaya (partially)"
        ]
      },
      {
        "town": "Yala",
        "areas": [
          "Yala Town Centre",
          "Yala Market",
          "Yala Sub-County Hospital",
          "Yala Polytechnic",
          "Yala-Kisumu Road",
          "Yala-Siaya Road",
          "Yala Swamp"
        ]
      },
      {
        "town": "Ahero",
        "areas": [
          "Ahero Town Centre",
          "Ahero Market",
          "Ahero Irrigation Scheme",
          "Ahero-Kisumu Road",
          "Kisumu County (bordering areas)"
        ]
      },
      {
        "town": "Rarieda",
        "areas": [
          "Rarieda Constituency",
          "Luwanda",
          "Nyang'oma Kogelo",
          "Bondo (partially)",
          "Siaya (partially)"
        ]
      },
      {
        "town": "Akala",
        "areas": [
          "Akala Town",
          "Akala Market",
          "Akala Dispensary"
        ]
      },
      {
        "town": "Amagoro",
        "areas": [
          "Amagoro Town",
          "Amagoro Market",
          "Amagoro Dispensary"
        ]
      },
      {
        "town": "Anyanga",
        "areas": [
          "Anyanga Town",
          "Anyanga Market",
          "Anyanga Dispensary"
        ]
      },
      {
        "town": "Asango",
        "areas": [
          "Asango Town",
          "Asango Market",
          "Asango Dispensary"
        ]
      },
      {
        "town": "Asembo Bay",
        "areas": [
          "Asembo Bay Town",
          "Asembo Bay Market",
          "Asembo Bay Port"
        ]
      },
      {
        "town": "Baraguyu",
        "areas": [
          "Baraguyu Town",
          "Baraguyu Market",
          "Baraguyu Dispensary"
        ]
      },
      {
        "town": "Bumala B",
        "areas": [
          "Bumala B Town",
          "Bumala B Market",
          "Bumala B Dispensary"
        ]
      },
      {
        "town": "Dibuoro",
        "areas": [
          "Dibuoro Town",
          "Dibuoro Market",
          "Dibuoro Dispensary"
        ]
      },
      {
        "town": "Gari",
        "areas": [
          "Gari Town",
          "Gari Market",
          "Gari Dispensary"
        ]
      },
      {
        "town": "Got Agulu",
        "areas": [
          "Got Agulu Town",
          "Got Agulu Market",
          "Got Agulu Dispensary"
        ]
      },
      {
        "town": "Igero",
        "areas": [
          "Igero Town",
          "Igero Market",
          "Igero Dispensary"
        ]
      },
      {
        "town": "Kagumo",
        "areas": [
          "Kagumo Town",
          "Kagumo Market",
          "Kagumo Dispensary"
        ]
      },
      {
        "town": "Kakangaja",
        "areas": [
          "Kakangaja Town",
          "Kakangaja Market",
          "Kakangaja Dispensary"
        ]
      },
      {
        "town": "Kamala",
        "areas": [
          "Kamala Town",
          "Kamala Market",
          "Kamala Dispensary"
        ]
      },
      {
        "town": "Kanyaboli",
        "areas": [
          "Kanyaboli Town",
          "Kanyaboli Market",
          "Kanyaboli Dispensary"
        ]
      },
      {
        "town": "Kanyadhiang",
        "areas": [
          "Kanyadhiang Town",
          "Kanyadhiang Market",
          "Kanyadhiang Dispensary"
        ]
      },
      {
        "town": "Kanyala",
        "areas": [
          "Kanyala Town",
          "Kanyala Market",
          "Kanyala Dispensary"
        ]
      },
      {
        "town": "Kanyango",
        "areas": [
          "Kanyango Town",
          "Kanyango Market",
          "Kanyango Dispensary"
        ]
      },
      {
        "town": "Kanyawegi",
        "areas": [
          "Kanyawegi Town",
          "Kanyawegi Market",
          "Kanyawegi Dispensary"
        ]
      },
      {
        "town": "Karemo",
        "areas": [
          "Karemo Town",
          "Karemo Market",
          "Karemo Dispensary"
        ]
      },
      {
        "town": "Katitu",
        "areas": [
          "Katitu Town",
          "Katitu Market",
          "Katitu Dispensary"
        ]
      },
      {
        "town": "Kibos",
        "areas": [
          "Kibos Town",
          "Kibos Market",
          "Kibos Dispensary"
        ]
      },
      {
        "town": "Kogelo",
        "areas": [
          "Kogelo Town",
          "Kogelo Market",
          "Kogelo Dispensary"
        ]
      },
      {
        "town": "Kokwanyo",
        "areas": [
          "Kokwanyo Town",
          "Kokwanyo Market",
          "Kokwanyo Dispensary"
        ]
      },
      {
        "town": "Kopiyo",
        "areas": [
          "Kopiyo Town",
          "Kopiyo Market",
          "Kopiyo Dispensary"
        ]
      },
      {
        "town": "Ligega",
        "areas": [
          "Ligega Town",
          "Ligega Market",
          "Ligega Dispensary"
        ]
      },
      {
        "town": "Lihanda",
        "areas": [
          "Lihanda Town",
          "Lihanda Market",
          "Lihanda Dispensary"
        ]
      },
      {
        "town": "Liranda",
        "areas": [
          "Liranda Town",
          "Liranda Market",
          "Liranda Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Homa Bay County",
    "towns": [
      {
        "town": "Homa Bay",
        "areas": [
          "Homa Bay Town Centre",
          "Homa Bay Pier",
          "Homa Bay County Referral Hospital",
          "Homa Bay University",
          "Homa Bay Market",
          "Homa Bay Bus Park",
          "Homa Bay Police Station",
          "Mbita",
          "Ndhiwa",
          "Rusinga Island",
          "Mfangano Island",
          "Lake Victoria"
        ]
      },
      {
        "town": "Mbita",
        "areas": [
          "Mbita Town Centre",
          "Mbita Ferry",
          "Mbita Market",
          "Mbita Sub-County Hospital",
          "Rusinga Island (partially)",
          "Mfangano Island (partially)",
          "Lake Victoria"
        ]
      },
      {
        "town": "Ndhiwa",
        "areas": [
          "Ndhiwa Town Centre",
          "Ndhiwa Market",
          "Ndhiwa Sub-County Hospital",
          "Ndhiwa Boys High School",
          "Ndhiwa Girls High School",
          "Homa Bay (partially)",
          "Migori County (bordering areas)"
        ]
      },
      {
        "town": "Oyugis",
        "areas": [
          "Oyugis Town Centre",
          "Oyugis Market",
          "Oyugis Sub-County Hospital",
          "Oyugis Boys High School",
          "Oyugis Girls High School",
          "Homa Bay (partially)",
          "Kisii County (bordering areas)"
        ]
      },
      {
        "town": "Sori",
        "areas": [
          "Sori Town Centre",
          "Sori Market",
          "Sori Beach",
          "Sori Port",
          "Lake Victoria",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Isebania",
        "areas": [
          "Isebania Town Centre",
          "Isebania Border Point (Kenya-Tanzania)",
          "Isebania Market",
          "Isebania Sub-County Hospital",
          "Migori County (bordering areas)",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Kendu Bay",
        "areas": [
          "Kendu Bay Town Centre",
          "Kendu Bay Market",
          "Kendu Bay Sub-County Hospital",
          "Kendu Bay Port",
          "Lake Victoria",
          "Homa Bay (partially)",
          "Kisumu County (bordering areas)"
        ]
      },
      {
        "town": "Ahero",
        "areas": [
          "Ahero Town Centre",
          "Ahero Market",
          "Ahero Irrigation Scheme",
          "Kisumu County (bordering areas)"
        ]
      },
      {
        "town": "Katito",
        "areas": [
          "Katito Town Centre",
          "Katito Market",
          "Katito Dispensary",
          "Kisumu County (bordering areas)"
        ]
      },
      {
        "town": "Pap Onditi",
        "areas": [
          "Pap Onditi Town Centre",
          "Pap Onditi Market",
          "Pap Onditi Dispensary",
          "Kisumu County (bordering areas)"
        ]
      },
      {
        "town": "Kipasi",
        "areas": [
          "Kipasi Town",
          "Kipasi Market",
          "Kipasi Dispensary"
        ]
      },
      {
        "town": "Kodingo",
        "areas": [
          "Kodingo Town",
          "Kodingo Market",
          "Kodingo Dispensary"
        ]
      },
          {
        "town": "Lambwe",
        "areas": [
          "Lambwe Town",
          "Lambwe Market",
          "Lambwe Dispensary"
        ]
      },
          {
        "town": "Liganga",
        "areas": [
          "Liganga Town",
          "Liganga Market",
          "Liganga Dispensary"
        ]
      },
          {
        "town": "Luanda Konyango",
        "areas": [
          "Luanda Konyango Town",
          "Luanda Konyango Market",
          "Luanda Konyango Dispensary"
        ]
      },
          {
        "town": "Mfangano Island",
        "areas": [
          "Mfangano Island",
          "Mbita (partially)",
          "Lake Victoria"
        ]
      },
          {
        "town": "Migori",
        "areas": [
          "Migori Town Centre",
          "Migori Market",
          "Migori Hospital",
          "Migori River",
          "Migori County (bordering areas)"
        ]
      },
          {
        "town": "Rusinga Island",
        "areas": [
          "Rusinga Island",
          "Mbita (partially)",
          "Lake Victoria"
        ]
      }
  
    ]
  },
  {
    "county": "Migori County",
    "towns": [
      {
        "town": "Migori",
        "areas": [
          "Migori Town Centre",
          "Migori County Referral Hospital",
          "Migori Airstrip",
          "Migori Market",
          "Migori Post Office",
          "Rongo (bordering areas)",
          "Awendo (bordering areas)",
          "Suna (bordering areas)",
          "Uriri (bordering areas)",
          "Nyatike (bordering areas)",
          "Muhuru Bay (bordering areas)",
          "Isebania (bordering areas)",
          "Homa Bay County (bordering areas)",
          "Kisii County (bordering areas)",
          "Nyamira County (bordering areas)",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Rongo",
        "areas": [
          "Rongo Town Centre",
          "Rongo Market",
          "Rongo Sub-County Hospital",
          "Rongo Agricultural Showground",
          "Migori (bordering areas)",
          "Awendo (bordering areas)",
          "Suna (bordering areas)"
        ]
      },
      {
        "town": "Awendo",
        "areas": [
          "Awendo Town Centre",
          "Awendo Market",
          "Awendo Sub-County Hospital",
          "Awendo Sugar Company",
          "Migori (bordering areas)",
          "Rongo (bordering areas)",
          "Uriri (bordering areas)"
        ]
      },
      {
        "town": "Suna",
        "areas": [
          "Suna Migori",
          "Suna East",
          "Suna West",
          "Migori (bordering areas)",
          "Rongo (bordering areas)",
          "Awendo (bordering areas)",
          "Uriri (bordering areas)"
        ]
      },
      {
        "town": "Uriri",
        "areas": [
          "Uriri Town Centre",
          "Uriri Market",
          "Uriri Sub-County Hospital",
          "Migori (bordering areas)",
          "Awendo (bordering areas)",
          "Suna (bordering areas)"
        ]
      },
      {
        "town": "Nyatike",
        "areas": [
          "Nyatike Constituency",
          "Isebania (bordering areas)",
          "Muhuru Bay (bordering areas)",
          "Lake Victoria",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Muhuru Bay",
        "areas": [
          "Muhuru Bay Town",
          "Muhuru Bay Market",
          "Muhuru Bay Port",
          "Lake Victoria",
          "Nyatike (bordering areas)"
        ]
      },
      {
        "town": "Isebania",
        "areas": [
          "Isebania Town Centre",
          "Isebania Border Point (Kenya-Tanzania)",
          "Isebania Market",
          "Nyatike (bordering areas)",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Macalder",
        "areas": [
          "Macalder Town",
          "Macalder Market",
          "Macalder Mines"
        ]
      },
          {
        "town": "Kehancha",
        "areas": [
          "Kehancha Town",
          "Kehancha Market",
          "Kehancha Sub-County Hospital"
        ]
      },
          {
        "town": "Ntimaru",
        "areas": [
          "Ntimaru Town",
          "Ntimaru Market",
          "Ntimaru Dispensary"
        ]
      },
          {
        "town": "Kuria East",
        "areas": [
          "Kuria East Region",
          "Kehancha (partially)",
          "Ntimaru (partially)",
          "Tanzania (bordering areas)"
        ]
      },
          {
        "town": "Kuria West",
        "areas": [
          "Kuria West Region",
          "Isebania (partially)",
          "Nyatike (partially)",
          "Tanzania (bordering areas)"
        ]
      }
    ]
  },
  {
    "county": "Marsabit County",
    "towns": [
      {
        "town": "Marsabit",
        "areas": [
          "Marsabit Town Centre",
          "Marsabit Market",
          "Marsabit County Hospital",
          "Marsabit Airport",
          "Marsabit National Park",
          "Saku",
          "Laisamis",
          "North Horr",
          "Moyale (bordering areas)",
          "Isiolo (bordering areas)"
        ]
      },
      {
        "town": "Moyale",
        "areas": [
          "Moyale Town Centre",
          "Moyale Market",
          "Moyale Hospital",
          "Moyale Airstrip",
          "Kenya-Ethiopia Border",
          "Marsabit (bordering areas)",
          "Wajir (bordering areas)"
        ]
      },
      {
        "town": "Laisamis",
        "areas": [
          "Laisamis Town Centre",
          "Laisamis Market",
          "Laisamis Dispensary",
          "Laisamis-Marsabit Road",
          "Marsabit (bordering areas)",
          "Isiolo (bordering areas)",
          "Samburu (bordering areas)"
        ]
      },
      {
        "town": "North Horr",
        "areas": [
          "North Horr Town Centre",
          "North Horr Market",
          "North Horr Dispensary",
          "Kenya-Ethiopia Border",
          "Lake Turkana (bordering areas)"
        ]
      },
      {
        "town": "Sololo",
        "areas": [
          "Sololo Town",
          "Sololo Market",
          "Sololo Dispensary"
        ]
      },
      {
        "town": "Loglogo",
        "areas": [
          "Loglogo Town",
          "Loglogo Market",
          "Loglogo Dispensary"
        ]
      },
      {
        "town": "Kargi",
        "areas": [
          "Kargi Town",
          "Kargi Market",
          "Kargi Dispensary"
        ]
      },
      {
        "town": "Korr",
        "areas": [
          "Korr Town",
          "Korr Market",
          "Korr Dispensary"
        ]
      },
      {
        "town": "Gabra",
        "areas": [
          "Gabra Town",
          "Gabra Market",
          "Gabra Dispensary"
        ]
      },
      {
        "town": "Turbi",
        "areas": [
          "Turbi Town",
          "Turbi Market",
          "Turbi Dispensary"
        ]
      },
      {
        "town": "Badana",
        "areas": [
          "Badana Town",
          "Badana Market",
          "Badana Dispensary"
        ]
      },
      {
        "town": "Butiye",
        "areas": [
          "Butiye Town",
          "Butiye Market",
          "Butiye Dispensary"
        ]
      },
      {
        "town": "Dabel",
        "areas": [
          "Dabel Town",
          "Dabel Market",
          "Dabel Dispensary"
        ]
      },
          {
        "town": "El Gade",
        "areas": [
          "El Gade Town",
          "El Gade Market",
          "El Gade Dispensary"
        ]
      },
          {
        "town": "Funanyata",
        "areas": [
          "Funanyata Town",
          "Funanyata Market",
          "Funanyata Dispensary"
        ]
      },
          {
        "town": "Galole",
        "areas": [
          "Galole Town",
          "Galole Market",
          "Galole Dispensary"
        ]
      },
          {
        "town": "Ganya",
        "areas": [
          "Ganya Town",
          "Ganya Market",
          "Ganya Dispensary"
        ]
      },
          {
        "town": "Huri Hills",
        "areas": [
          "Huri Hills Town",
          "Huri Hills Market",
          "Huri Hills Dispensary"
        ]
      },
          {
        "town": "Ileret",
        "areas": [
          "Ileret Town",
          "Ileret Market",
          "Ileret Dispensary"
        ]
      },
          {
        "town": "Kibish",
        "areas": [
          "Kibish Town",
          "Kibish Market",
          "Kibish Dispensary"
        ]
      },
          {
        "town": "Kokuro",
        "areas": [
          "Kokuro Town",
          "Kokuro Market",
          "Kokuro Dispensary"
        ]
      },
          {
        "town": "Liang",
        "areas": [
          "Liang Town",
          "Liang Market",
          "Liang Dispensary"
        ]
      },
          {
        "town": "Lokitaung",
        "areas": [
          "Lokitaung Town",
          "Lokitaung Market",
          "Lokitaung Dispensary"
        ]
      },
          {
        "town": "Loiyangalani",
        "areas": [
          "Loiyangalani Town",
          "Loiyangalani Market",
          "Loiyangalani Dispensary"
        ]
      },
          {
        "town": "Loyoro",
        "areas": [
          "Loyoro Town",
          "Loyoro Market",
          "Loyoro Dispensary"
        ]
      },
          {
        "town": "Maikona",
        "areas": [
          "Maikona Town",
          "Maikona Market",
          "Maikona Dispensary"
        ]
      },
          {
        "town": "Marsabit National Reserve",
        "areas": [
          "Marsabit National Reserve",
          "Lake Paradise",
          "Mt. Marsabit",
          "Forest Area"
        ]
      },
          {
        "town": "Melo",
        "areas": [
          "Melo Town",
          "Melo Market",
          "Melo Dispensary"
        ]
      },
          {
        "town": "Mlima Nyiro",
        "areas": [
          "Mlima Nyiro Town",
          "Mlima Nyiro Market",
          "Mlima Nyiro Dispensary"
        ]
      },
          {
        "town": "Moyale Township",
        "areas": [
          "Moyale Township",
          "Moyale Market",
          "Moyale Hospital"
        ]
      },
          {
        "town": "Nairobi Camp",
        "areas": [
          "Nairobi Camp Town",
          "Nairobi Camp Market",
          "Nairobi Camp Dispensary"
        ]
      },
          {
        "town": "Namatina",
        "areas": [
          "Namatina Town",
          "Namatina Market",
          "Namatina Dispensary"
        ]
      },
          {
        "town": "Olbora",
        "areas": [
          "Olbora Town",
          "Olbora Market",
          "Olbora Dispensary"
        ]
      },
          {
        "town": "Oror",
        "areas": [
          "Oror Town",
          "Oror Market",
          "Oror Dispensary"
        ]
      },
          {
        "town": "Sagana",
        "areas": [
          "Sagana Town",
          "Sagana Market",
          "Sagana Dispensary"
        ]
      },
          {
        "town": "Sarova Shaba Lodge",
        "areas": [
          "Sarova Shaba Lodge",
          "Shaba National Reserve"
        ]
      },
          {
        "town": "Shaba National Reserve",
        "areas": [
          "Shaba National Reserve",
          "Sarova Shaba Lodge"
        ]
      },
          {
        "town": "Songa",
        "areas": [
          "Songa Town",
          "Songa Market",
          "Songa Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Samburu County",
    "towns": [
      {
        "town": "Maralal",
        "areas": [
          "Maralal Town Centre",
          "Maralal Market",
          "Maralal Hospital",
          "Maralal Police Station",
          "Maralal Airport",
          "Maralal Game Sanctuary",
          "Kiltamany",
          "Loosuk",
          "Ngelai",
          "Suguta Valley (bordering areas)",
          "Lake Turkana (bordering areas)"
        ]
      },
      {
        "town": "Wamba",
        "areas": [
          "Wamba Town Centre",
          "Wamba Market",
          "Wamba Hospital",
          "Wamba Airstrip",
          "Wamba Hills",
          "Lolkisio",
          "Angata Nanyokie",
          "Kirisia",
          "Serolevi",
          "Mathare (bordering areas)"
        ]
      },
      {
        "town": "Archer's Post",
        "areas": [
          "Archer's Post Town Centre",
          "Archer's Post Market",
          "Archer's Post Airstrip",
          "Isiolo (bordering areas)",
          "Samburu National Reserve (bordering areas)",
          "Buffalo Springs National Reserve (bordering areas)"
        ]
      },
      {
        "town": "Lodungokwe",
        "areas": [
          "Lodungokwe Town",
          "Lodungokwe Market",
          "Lodungokwe Dispensary"
        ]
      },
      {
        "town": "Sereolipi",
        "areas": [
          "Sereolipi Town",
          "Sereolipi Market",
          "Sereolipi Dispensary"
        ]
      },
      {
        "town": "South Horr",
        "areas": [
          "South Horr Town",
          "South Horr Market",
          "South Horr Dispensary"
        ]
      },
      {
        "town": "Suguta Marmar",
        "areas": [
          "Suguta Marmar Town",
          "Suguta Marmar Market",
          "Suguta Marmar Dispensary"
        ]
      },
      {
        "town": "Marti",
        "areas": [
          "Marti Town",
          "Marti Market",
          "Marti Dispensary"
        ]
      },
      {
        "town": "Morijo",
        "areas": [
          "Morijo Town",
          "Morijo Market",
          "Morijo Dispensary"
        ]
      },
      {
        "town": "Ngelai",
        "areas": [
          "Ngelai Town",
          "Ngelai Market",
          "Ngelai Dispensary"
        ]
      },
      {
        "town": "Opiroi",
        "areas": [
          "Opiroi Town",
          "Opiroi Market",
          "Opiroi Dispensary"
        ]
      },
      {
        "town": "Porro",
        "areas": [
          "Porro Town",
          "Porro Market",
          "Porro Dispensary"
        ]
      },
      {
        "town": "Sarara",
        "areas": [
          "Sarara Town",
          "Sarara Market",
          "Sarara Dispensary"
        ]
      },
      {
        "town": "Seya",
        "areas": [
          "Seya Town",
          "Seya Market",
          "Seya Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Tana River County",
    "towns": [
      {
        "town": "Hola",
        "areas": [
          "Hola Town Centre",
          "Hola Market",
          "Hola County Referral Hospital",
          "Hola Police Station",
          "Hola Prison",
          "Tana River County Headquarters",
          "Galole",
          "Garsen",
          "Bura",
          "Madogo",
          "Tana Delta",
          "Tana River (bordering areas)"
        ]
      },
      {
        "town": "Garsen",
        "areas": [
          "Garsen Town Centre",
          "Garsen Market",
          "Garsen Dispensary",
          "Garsen Primary School",
          "Garsen Secondary School",
          "Tana Delta",
          "Hola (bordering areas)",
          "Lamu County (bordering areas)"
        ]
      },
      {
        "town": "Bura",
        "areas": [
          "Bura Town Centre",
          "Bura Irrigation Scheme",
          "Bura Market",
          "Bura Dispensary",
          "Bura Primary School",
          "Bura Secondary School",
          "Hola (bordering areas)",
          "Garissa County (bordering areas)"
        ]
      },
      {
        "town": "Madogo",
        "areas": [
          "Madogo Town Centre",
          "Madogo Market",
          "Madogo Dispensary",
          "Madogo Primary School",
          "Madogo Secondary School",
          "Garissa County (bordering areas)",
          "Isiolo County (bordering areas)"
        ]
      },
          {
        "town": "Galole",
        "areas": [
          "Galole Town",
          "Galole Market",
          "Galole Dispensary"
        ]
      },
          {
        "town": "Tana Delta",
        "areas": [
          "Tana Delta Area",
          "Kipini",
          "Ozi",
          "Garsen (bordering areas)",
          "Lamu County (bordering areas)",
          "Indian Ocean"
        ]
      },
          {
        "town": "Kipini",
        "areas": [
          "Kipini Town",
          "Kipini Market",
          "Kipini Dispensary"
        ]
      },
          {
        "town": "Ozi",
        "areas": [
          "Ozi Town",
          "Ozi Market",
          "Ozi Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Lamu County",
    "towns": [
      {
        "town": "Lamu Town",
        "areas": [
          "Lamu Town",
          "Shela",
          "Manda Island",
          "Lamu Archipelago",
          "Lamu Old Town",
          "Stone Town",
          "Fort of Lamu",
          "Lamu Museum",
          "Donkey Sanctuary",
          "Shela Beach",
          "Manda Bay",
          "Matondoni",
          "Kipungani"
        ]
      },
      {
        "town": "Mpeketoni",
        "areas": [
          "Mpeketoni Town",
          "Mpeketoni Market",
          "Mpeketoni Hospital",
          "Mpeketoni Police Station",
          "Mpeketoni Agricultural Training Centre",
          "Witu",
          "Hindi",
          "Siyu",
          "Pandanguo"
        ]
      },
      {
        "town": "Witu",
        "areas": [
          "Witu Town",
          "Witu Market",
          "Witu Dispensary",
          "Witu Police Station",
          "Witu Forest",
          "Tana River County (bordering areas)"
        ]
      },
      {
        "town": "Hindi",
        "areas": [
          "Hindi Town",
          "Hindi Market",
          "Hindi Dispensary",
          "Hindi Agricultural Centre",
          "Mpeketoni (bordering areas)"
        ]
      },
      {
        "town": "Siyu",
        "areas": [
          "Siyu Town",
          "Siyu Fort",
          "Siyu Island",
          "Pate Island",
          "Lamu Archipelago"
        ]
      },
      {
        "town": "Pandanguo",
        "areas": [
          "Pandanguo Town",
          "Pandanguo Market",
          "Pandanguo Dispensary",
          "Tana River County (bordering areas)"
        ]
      },
      {
        "town": "Kipungani",
        "areas": [
          "Kipungani Village",
          "Kipungani Beach",
          "Lamu Archipelago",
          "Lamu Town (accessible by boat)"
        ]
      },
      {
        "town": "Matondoni",
        "areas": [
          "Matondoni Village",
          "Matondoni Dhow Building",
          "Lamu Archipelago",
          "Lamu Town (accessible by boat)"
        ]
      },
      {
        "town": "Shela",
        "areas": [
          "Shela Village",
          "Shela Beach",
          "Peponi Hotel Area",
          "Lamu Town (accessible by boat)",
          "Manda Island (accessible by boat)"
        ]
      },
      {
        "town": "Manda Island",
        "areas": [
          "Manda Airport",
          "Manda Bay",
          "Lamu Town (accessible by boat)",
          "Shela (accessible by boat)"
        ]
      }
    ]
  },
  {
    "county": "Turkana County",
    "towns": [
      {
        "town": "Lodwar",
        "areas": [
          "Lodwar Town Centre",
          "Lodwar Airport Area",
          "Lodwar County Headquarters Area",
          "Lodwar Referral Hospital Area",
          "Lodwar High School Area",
          "Lodwar Polytechnic Area",
          "Kakalel",
          "Kanamkemer",
          "Kang'itotha",
          "Narewa",
          "Napuu",
          "Lokichar",
          "Lokichogio",
          "Kakuma",
          "Kalokol",
          "Turkana University Area",
          "Kerio Delta",
          "Lake Turkana",
          "Ferguson's Gulf",
          "Eliye Springs",
          "Central Lodwar",
          "Eastern Lodwar",
          "Northern Lodwar",
          "Southern Lodwar",
          "Kibish",
          "Nadapal",
          "Todonyang",
          "Omo River (bordering areas)",
          "South Sudan (bordering areas)",
          "Uganda (bordering areas)",
          "Kenya-Ethiopia Border"
        ]
      },
      {
        "town": "Lokichogio",
        "areas": [
          "Lokichogio Town Centre",
          "Lokichogio Airport",
          "Lokichogio Hospital",
          "Lokichogio Market",
          "Kakuma (bordering areas)",
          "South Sudan (bordering areas)"
        ]
      },
      {
        "town": "Kakuma",
        "areas": [
          "Kakuma Town Centre",
          "Kakuma Refugee Camp",
          "Kakuma Market",
          "Kakuma Hospital",
          "Lokichogio (bordering areas)"
        ]
      },
      {
        "town": "Lokichar",
        "areas": [
          "Lokichar Town Centre",
          "Lokichar Market",
          "Lokichar Hospital",
          "Lodwar (bordering areas)"
        ]
      },
      {
        "town": "Kalokol",
        "areas": [
          "Kalokol Town Centre",
          "Kalokol Market",
          "Kalokol Fishing Area",
          "Lake Turkana"
        ]
      },
      {
        "town": "Turkana University",
        "areas": [
          "Turkana University Main Campus",
          "Turkana University Farm",
          "Lodwar (bordering areas)"
        ]
      },
      {
        "town": "Kerio Delta",
        "areas": [
          "Kerio Delta",
          "Lake Turkana",
          "Lodwar (bordering areas)"
        ]
      },
      {
        "town": "Eliye Springs",
        "areas": [
          "Eliye Springs Resort",
          "Lake Turkana"
        ]
      },
      {
        "town": "Kibish",
        "areas": [
          "Kibish Town",
          "Kibish Market",
          "Ethiopia (bordering areas)"
        ]
      },
      {
        "town": "Nadapal",
        "areas": [
          "Nadapal Border Point (Kenya-South Sudan)",
          "South Sudan (bordering areas)"
        ]
      },
      {
        "town": "Todonyang",
        "areas": [
          "Todonyang Town",
          "Todonyang Market",
          "Ethiopia (bordering areas)"
        ]
      },
          {
        "town": "Ferguson's Gulf",
        "areas": [
          "Ferguson's Gulf",
          "Lake Turkana"
        ]
      }
  
    ]
  },
  {
    "county": "Wajir County",
    "towns": [
      {
        "town": "Wajir Town",
        "areas": [
          "Wajir Town Centre",
          "Wajir Airport",
          "Wajir County Referral Hospital",
          "Wajir High School",
          "Wajir Girls High School",
          "Wajir Polytechnic",
          "Wajir Market",
          "Wajir Bus Park",
          "Wajir Stadium",
          "Wajir Hill",
          "Wajir Bor",
          "Wajir East",
          "Wajir West",
          "Wajir North",
          "Wajir South",
          "Ewaso Nyiro River (bordering areas)",
          "Isiolo County (bordering areas)",
          "Garissa County (bordering areas)",
          "Mandera County (bordering areas)"
        ]
      },
      {
        "town": "Habaswein",
        "areas": [
          "Habaswein Town Centre",
          "Habaswein Market",
          "Habaswein Hospital",
          "Habaswein Police Station",
          "Habaswein Primary School",
          "Habaswein Secondary School",
          "Wajir (bordering areas)",
          "Garissa (bordering areas)"
        ]
      },
      {
        "town": "Dif",
        "areas": [
          "Dif Town Centre",
          "Dif Market",
          "Dif Hospital",
          "Dif Police Station",
          "Dif Primary School",
          "Dif Secondary School",
          "Wajir (bordering areas)",
          "Garissa (bordering areas)",
          "Somalia (bordering areas)"
        ]
      },
      {
        "town": "Tarbaj",
        "areas": [
          "Tarbaj Town Centre",
          "Tarbaj Market",
          "Tarbaj Hospital",
          "Tarbaj Police Station",
          "Tarbaj Primary School",
          "Tarbaj Secondary School",
          "Wajir (bordering areas)",
          "Garissa (bordering areas)"
        ]
      },
      {
        "town": "El Wak",
        "areas": [
          "El Wak Town Centre",
          "El Wak Market",
          "El Wak Hospital",
          "El Wak Police Station",
          "El Wak Primary School",
          "El Wak Secondary School",
          "Mandera (bordering areas)",
          "Somalia (bordering areas)"
        ]
      },
      {
        "town": "Buna",
        "areas": [
          "Buna Town",
          "Buna Market",
          "Buna Dispensary"
        ]
      },
      {
        "town": "Gerile",
        "areas": [
          "Gerile Town",
          "Gerile Market",
          "Gerile Dispensary"
        ]
      },
      {
        "town": "Hadado",
        "areas": [
          "Hadado Town",
          "Hadado Market",
          "Hadado Dispensary"
        ]
      },
      {
        "town": "Khorof Harar",
        "areas": [
          "Khorof Harar Town",
          "Khorof Harar Market",
          "Khorof Harar Dispensary"
        ]
      },
      {
        "town": "Lagalboghol",
        "areas": [
          "Lagalboghol Town",
          "Lagalboghol Market",
          "Lagalboghol Dispensary"
        ]
      },
      {
        "town": "Leheley",
        "areas": [
          "Leheley Town",
          "Leheley Market",
          "Leheley Dispensary"
        ]
      },
      {
        "town": "Mathaja",
        "areas": [
          "Mathaja Town",
          "Mathaja Market",
          "Mathaja Dispensary"
        ]
      },
      {
        "town": "Mundul",
        "areas": [
          "Mundul Town",
          "Mundul Market",
          "Mundul Dispensary"
        ]
      },
      {
        "town": "Qoqane",
        "areas": [
          "Qoqane Town",
          "Qoqane Market",
          "Qoqane Dispensary"
        ]
      },
      {
        "town": "Shaft",
        "areas": [
          "Shaft Town",
          "Shaft Market",
          "Shaft Dispensary"
        ]
      },
      {
        "town": "Takaba",
        "areas": [
          "Takaba Town",
          "Takaba Market",
          "Takaba Dispensary"
        ]
      },
      {
        "town": "Wagalla",
        "areas": [
          "Wagalla Town",
          "Wagalla Market",
          "Wagalla Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Mandera County",
    "region": "North Eastern",
    "towns": [
      {
        "town": "Mandera Town",
        "areas": [
          "Mandera Town Centre",
          "Mandera Airport",
          "Mandera County Referral Hospital",
          "Mandera Police Station",
          "Mandera Market",
          "Mandera East",
          "Mandera West",
          "Mandera North",
          "Mandera South",
          "Border areas with Ethiopia and Somalia"
        ]
      },
      {
        "town": "El Wak",
        "areas": [
          "El Wak Town Centre",
          "El Wak Market",
          "El Wak Hospital",
          "El Wak Police Station",
          "Border area with Somalia"
        ]
      },
      {
        "town": "Wargadud",
        "areas": [
          "Wargadud Town",
          "Wargadud Market",
          "Wargadud Dispensary"
        ]
      },
          {
        "town": "Lafey",
        "areas": [
          "Lafey Town",
          "Lafey Market",
          "Lafey Dispensary"
        ]
      },
          {
        "town": "Banissa",
        "areas": [
          "Banissa Town",
          "Banissa Market",
          "Banissa Dispensary"
        ]
      },
          {
        "town": "Kutulo",
        "areas": [
          "Kutulo Town",
          "Kutulo Market",
          "Kutulo Dispensary"
        ]
      },
          {
        "town": "Takaba",
        "areas": [
          "Takaba Town",
          "Takaba Market",
          "Takaba Dispensary"
        ]
      },
          {
        "town": "Shimbir Fatuma",
        "areas": [
          "Shimbir Fatuma Town",
          "Shimbir Fatuma Market",
          "Shimbir Fatuma Dispensary"
        ]
      },
          {
        "town": "Arabia",
        "areas": [
          "Arabia Town",
          "Arabia Market",
          "Arabia Dispensary"
        ]
      },
          {
        "town": "Ashabito",
        "areas": [
          "Ashabito Town",
          "Ashabito Market",
          "Ashabito Dispensary"
        ]
      },
          {
        "town": "Boji Garas",
        "areas": [
          "Boji Garas Town",
          "Boji Garas Market",
          "Boji Garas Dispensary"
        ]
      },
          {
        "town": "Dandu",
        "areas": [
          "Dandu Town",
          "Dandu Market",
          "Dandu Dispensary"
        ]
      },
          {
        "town": "Derakhale",
        "areas": [
          "Derakhale Town",
          "Derakhale Market",
          "Derakhale Dispensary"
        ]
      },
          {
        "town": "Fino",
        "areas": [
          "Fino Town",
          "Fino Market",
          "Fino Dispensary"
        ]
      },
          {
        "town": "Gither",
        "areas": [
          "Gither Town",
          "Gither Market",
          "Gither Dispensary"
        ]
      },
          {
        "town": "Halu",
        "areas": [
          "Halu Town",
          "Halu Market",
          "Halu Dispensary"
        ]
      },
          {
        "town": "Hareri Hos",
        "areas": [
          "Hareri Hos Town",
          "Hareri Hos Market",
          "Hareri Hos Dispensary"
        ]
      },
          {
        "town": "Hilalio",
        "areas": [
          "Hilalio Town",
          "Hilalio Market",
          "Hilalio Dispensary"
        ]
      },
          {
        "town": "Jibey",
        "areas": [
          "Jibey Town",
          "Jibey Market",
          "Jibey Dispensary"
        ]
      },
          {
        "town": "Khalalio",
        "areas": [
          "Khalalio Town",
          "Khalalio Market",
          "Khalalio Dispensary"
        ]
      },
          {
        "town": "Kiliwehiri",
        "areas": [
          "Kiliwehiri Town",
          "Kiliwehiri Market",
          "Kiliwehiri Dispensary"
        ]
      },
          {
        "town": "Kutulo",
        "areas": [
          "Kutulo Town",
          "Kutulo Market",
          "Kutulo Dispensary"
        ]
      },
          {
        "town": "Laga Bogal",
        "areas": [
          "Laga Bogal Town",
          "Laga Bogal Market",
          "Laga Bogal Dispensary"
        ]
      },
          {
        "town": "Libeh",
        "areas": [
          "Libeh Town",
          "Libeh Market",
          "Libeh Dispensary"
        ]
      },
          {
        "town": "Lokoho",
        "areas": [
          "Lokoho Town",
          "Lokoho Market",
          "Lokoho Dispensary"
        ]
      },
          {
        "town": "Manyatta",
        "areas": [
          "Manyatta Town",
          "Manyatta Market",
          "Manyatta Dispensary"
        ]
      },
          {
        "town": "Mbalambala",
        "areas": [
          "Mbalambala Town",
          "Mbalambala Market",
          "Mbalambala Dispensary"
        ]
      },
          {
        "town": "Mogor",
        "areas": [
          "Mogor Town",
          "Mogor Market",
          "Mogor Dispensary"
        ]
      },
          {
        "town": "Nuno",
        "areas": [
          "Nuno Town",
          "Nuno Market",
          "Nuno Dispensary"
        ]
      },
          {
        "town": "Rhamu",
        "areas": [
          "Rhamu Town",
          "Rhamu Market",
          "Rhamu Dispensary"
        ]
      },
          {
        "town": "Sala",
        "areas": [
          "Sala Town",
          "Sala Market",
          "Sala Dispensary"
        ]
      },
          {
        "town": "Shidle",
        "areas": [
          "Shidle Town",
          "Shidle Market",
          "Shidle Dispensary"
        ]
      },
          {
        "town": "Tarbaj",
        "areas": [
          "Tarbaj Town",
          "Tarbaj Market",
          "Tarbaj Dispensary"
        ]
      },
          {
        "town": "Waso",
        "areas": [
          "Waso Town",
          "Waso Market",
          "Waso Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Taita Taveta County",
    "towns": [
      {
        "town": "Voi",
        "areas": [
          "Voi Town Centre",
          "Voi Railway Station",
          "Voi Market",
          "Voi Bus Park",
          "Voi Hospital",
          "Voi Police Station",
          "Voi Safari Lodge",
          "Mbololo",
          "Sagala",
          "Wundanyi",
          "Taveta (bordering areas)",
          "Mwatate",
          "Tsavo East National Park (bordering areas)",
          "Tsavo West National Park (bordering areas)",
          "Voi-Mombasa Road",
          "Voi-Taveta Road",
          "Voi-Mwatate Road",
          "Voi-Wundanyi Road"
        ]
      },
      {
        "town": "Wundanyi",
        "areas": [
          "Wundanyi Town Centre",
          "Wundanyi Market",
          "Wundanyi Hospital",
          "Wundanyi Police Station",
          "Wundanyi Hill",
          "Wundanyi-Voi Road",
          "Wundanyi-Mwatate Road",
          "Bura",
          "Mbale",
          "Mwanda",
          "Werugha"
        ]
      },
      {
        "town": "Mwatate",
        "areas": [
          "Mwatate Town Centre",
          "Mwatate Market",
          "Mwatate Hospital",
          "Mwatate Police Station",
          "Mwatate-Voi Road",
          "Mwatate-Wundanyi Road",
          "Mwatate-Taveta Road",
          "Mghamboyi",
          "Ronjo",
          "Msau"
        ]
      },
      {
        "town": "Taveta",
        "areas": [
          "Taveta Town Centre",
          "Taveta Border Point (Kenya-Tanzania)",
          "Taveta Market",
          "Taveta Hospital",
          "Taveta Police Station",
          "Taveta-Voi Road",
          "Taveta-Mwatate Road",
          "Taveta-Arusha Road (Tanzania)",
          "Holili (Tanzania) (bordering areas)",
          "Jipe Lake",
          "Chala Crater Lake"
        ]
      },
      {
        "town": "Bura",
        "areas": [
          "Bura Town",
          "Bura Market",
          "Bura Dispensary",
          "Bura Irrigation Scheme",
          "Mwacharo",
          "Maktau"
        ]
      },
      {
        "town": "Mghamboyi",
        "areas": [
          "Mghamboyi Town",
          "Mghamboyi Market",
          "Mghamboyi Dispensary",
          "Mghamboyi-Wundanyi Road"
        ]
      },
          {
        "town": "Mbale",
        "areas": [
          "Mbale Town",
          "Mbale Market",
          "Mbale Dispensary"
        ]
      },
          {
        "town": "Mwanda",
        "areas": [
          "Mwanda Town",
          "Mwanda Market",
          "Mwanda Dispensary"
        ]
      },
          {
        "town": "Werugha",
        "areas": [
          "Werugha Town",
          "Werugha Market",
          "Werugha Dispensary"
        ]
      },
          {
        "town": "Mwacharo",
        "areas": [
          "Mwacharo Town",
          "Mwacharo Market",
          "Mwacharo Dispensary"
        ]
      },
          {
        "town": "Maktau",
        "areas": [
          "Maktau Town",
          "Maktau Market",
          "Maktau Dispensary"
        ]
      },
          {
        "town": "Ronjo",
        "areas": [
          "Ronjo Town",
          "Ronjo Market",
          "Ronjo Dispensary"
        ]
      },
          {
        "town": "Msau",
        "areas": [
          "Msau Town",
          "Msau Market",
          "Msau Dispensary"
        ]
      }
  
    ]
  },
  {
    "county": "Kilifi County",
    "towns": [
      {
        "town": "Kilifi",
        "areas": [
          "Kilifi Town Centre",
          "Kilifi Creek",
          "Kilifi Bridge",
          "Kilifi Beach",
          "Kilifi Market",
          "Kilifi County Hospital",
          "Kilifi Police Station",
          "Mtwapa (bordering areas)",
          "Malindi (bordering areas)",
          "Bamburi (bordering areas)",
          "Shanzu (bordering areas)",
          "Watamu (bordering areas)",
          "Takaungu",
          "Mnarani",
          "Kibarani",
          "Sokoni",
          "Majengo",
          "Kaloleni",
          "Mombasa-Malindi Highway",
          "Kilifi-Mtwapa Road",
          "Kilifi-Malindi Road",
          "Kilifi-Bamburi Road",
          "Kilifi-Shanzu Road",
          "Kilifi-Watamu Road"
        ]
      },
      {
        "town": "Malindi",
        "areas": [
          "Malindi Town Centre",
          "Malindi Beach",
          "Malindi Marine Park",
          "Portuguese Chapel",
          "Vasco da Gama Pillar",
          "Malindi Airport",
          "Malindi Market",
          "Malindi Hospital",
          "Casuarina",
          "Silversands",
          "Mayungu",
          "Watamu (bordering areas)",
          "Kilifi (bordering areas)",
          "Mombasa-Malindi Highway",
          "Malindi-Watamu Road",
          "Malindi-Kilifi Road"
        ]
      },
      {
        "town": "Mtwapa",
        "areas": [
          "Mtwapa Town Centre",
          "Mtwapa Creek",
          "Mtwapa Bridge",
          "Mtwapa Market",
          "Mtwapa Shopping Centre",
          "Mtwapa Estate",
          "Kilifi (bordering areas)",
          "Mombasa (bordering areas)",
          "Mombasa-Malindi Highway",
          "Mtwapa-Kilifi Road",
          "Mtwapa-Mombasa Road"
        ]
      },
      {
        "town": "Watamu",
        "areas": [
          "Watamu Town Centre",
          "Watamu Beach",
          "Watamu Marine National Park",
          "Gedi Ruins",
          "Arabuko Sokoke Forest",
          "Malindi (bordering areas)",
          "Kilifi (bordering areas)",
          "Watamu-Malindi Road",
          "Watamu-Kilifi Road"
        ]
      },
      {
        "town": "Mariakani",
        "areas": [
          "Mariakani Town Centre",
          "Mariakani Market",
          "Mariakani Hospital",
          "Mariakani Railway Station",
          "Mariakani-Mombasa Road",
          "Mariakani-Kaloleni Road",
          "Kaloleni (bordering areas)",
          "Kinango (bordering areas)"
        ]
      },
      {
        "town": "Kaloleni",
        "areas": [
          "Kaloleni Town Centre",
          "Kaloleni Market",
          "Kaloleni Hospital",
          "Kaloleni-Mariakani Road",
          "Kaloleni-Kilifi Road",
          "Mariakani (bordering areas)",
          "Kilifi (bordering areas)"
        ]
      },
          {
        "town": "Takaungu",
        "areas": [
          "Takaungu Town",
          "Takaungu Market",
          "Takaungu Beach"
        ]
      },
          {
        "town": "Mnarani",
        "areas": [
          "Mnarani",
          "Mnarani Ruins",
          "Mnarani Cliffs"
        ]
      },
          {
        "town": "Kibarani",
        "areas": [
          "Kibarani",
          "Kibarani Market",
          "Kibarani Area"
        ]
      },
          {
        "town": "Sokoni",
        "areas": [
          "Sokoni",
          "Sokoni Market",
          "Sokoni Area"
        ]
      },
          {
        "town": "Majengo",
        "areas": [
          "Majengo",
          "Majengo Market",
          "Majengo Area"
        ]
      }
    ]
  },
  {
    "county": "Kwale County",
    "towns": [
      {
        "town": "Ukunda",
        "areas": [
          "Ukunda Town Centre",
          "Diani Beach",
          "Msambweni",
          "Galu Kinondo",
          "Kongo",
          "Diani Airport (Ukunda Airport) Area",
          "Diani Forest",
          "Colobus Conservation Area",
          "Marine Park (bordering areas)"
        ]
      },
      {
        "town": "Msambweni",
        "areas": [
          "Msambweni Town Centre",
          "Msambweni Market",
          "Msambweni Hospital",
          "Msambweni Port",
          "Msambweni Beach",
          "Ukunda (bordering areas)",
          "Lungalunga (bordering areas)"
        ]
      },
      {
        "town": "Lungalunga",
        "areas": [
          "Lungalunga Town Centre",
          "Lungalunga Border Point (Kenya-Tanzania)",
          "Lungalunga Market",
          "Lungalunga Forest",
          "Msambweni (bordering areas)",
          "Vanga (bordering areas)",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Vanga",
        "areas": [
          "Vanga Town Centre",
          "Vanga Border Point (Kenya-Tanzania)",
          "Vanga Market",
          "Vanga Beach",
          "Lungalunga (bordering areas)",
          "Shimoni (bordering areas)",
          "Tanzania (bordering areas)"
        ]
      },
      {
        "town": "Shimoni",
        "areas": [
          "Shimoni Town Centre",
          "Shimoni Port",
          "Shimoni Caves",
          "Kisite-Mpunguti Marine National Park",
          "Vanga (bordering areas)"
        ]
      },
      {
        "town": "Kinango",
        "areas": [
          "Kinango Town Centre",
          "Kinango Market",
          "Kinango Hospital",
          "Kinango Forest",
          "Kwale (bordering areas)",
          "Mombasa County (bordering areas)",
          "Taita Taveta County (bordering areas)"
        ]
      },
      {
        "town": "Kwale",
        "areas": [
          "Kwale Town Centre",
          "Kwale Market",
          "Kwale Hospital",
          "Kwale Forest",
          "Kinango (bordering areas)",
          "Matuga (bordering areas)"
        ]
      },
      {
        "town": "Matuga",
        "areas": [
          "Matuga Town Centre",
          "Matuga Market",
          "Matuga Forest",
          "Kwale (bordering areas)",
          "Mombasa County (bordering areas)"
        ]
      },
          {
        "town": "Galu",
        "areas": [
          "Galu Town",
          "Galu Market",
          "Galu Beach"
        ]
      },
          {
        "town": "Kinondo",
        "areas": [
          "Kinondo Town",
          "Kinondo Market",
          "Kinondo Beach"
        ]
      },
          {
        "town": "Kongo",
        "areas": [
          "Kongo Town",
          "Kongo Market",
          "Kongo Beach"
        ]
      },
          {
        "town": "Mwangulu",
        "areas": [
          "Mwangulu Town",
          "Mwangulu Market",
          "Mwangulu Dispensary"
        ]
      },
          {
        "town": "Ramisi",
        "areas": [
          "Ramisi Town",
          "Ramisi Market",
          "Ramisi Sugar Factory"
        ]
      },
          {
        "town": "Samburu",
        "areas": [
          "Samburu Town",
          "Samburu Market",
          "Samburu Dispensary"
        ]
      }
    ]
  },
  {
    "county": "Bungoma County",
    "towns": [
      {
        "town": "Bungoma Town",
        "areas": [
          "Bungoma Town Centre",
          "Bungoma Market",
          "Bungoma County Referral Hospital",
          "Bungoma Bus Park",
          "Bungoma Post Office",
          "Bungoma Stadium",
          "Bungoma National Polytechnic",
          "Bungoma West",
          "Bungoma East",
          "Bungoma North",
          "Bungoma South",
          "Kanduyi",
          "Musikoma",
          "Mung'oma",
          "Sichei",
          "Marrel",
          "Bokoli",
          "Nalondo",
          "Lukhonge",
          "Webuye (bordering areas)",
          "Kimilili (bordering areas)",
          "Sirisia (bordering areas)",
          "Trans Nzoia County (bordering areas)",
          "Busia County (bordering areas)",
          "Uganda (bordering areas)"
        ]
      },
      {
        "town": "Webuye",
        "areas": [
          "Webuye Town Centre",
          "Webuye Market",
          "Webuye Sub-County Hospital",
          "Webuye Bus Park",
          "Pan Paper Mills",
          "Webuye West",
          "Webuye East",
          "Bungoma (bordering areas)",
          "Kimilili (bordering areas)",
          "Lugari (bordering areas)"
        ]
      },
      {
        "town": "Kimilili",
        "areas": [
          "Kimilili Town Centre",
          "Kimilili Market",
          "Kimilili Sub-County Hospital",
          "Kimilili Bus Park",
          "Kimilili West",
          "Kimilili East",
          "Bungoma (bordering areas)",
          "Webuye (bordering areas)",
          "Sirisia (bordering areas)",
          "Lugari (bordering areas)"
        ]
      },
      {
        "town": "Sirisia",
        "areas": [
          "Sirisia Town Centre",
          "Sirisia Market",
          "Sirisia Sub-County Hospital",
          "Sirisia Bus Park",
          "Sirisia West",
          "Sirisia East",
          "Bungoma (bordering areas)",
          "Kimilili (bordering areas)",
          "Busia County (bordering areas)",
          "Uganda (bordering areas)"
        ]
      },
      {
        "town": "Kanduyi",
        "areas": [
          "Kanduyi Town",
          "Kanduyi Market",
          "Bungoma (bordering areas)"
        ]
      },
          {
        "town": "Lugari",
        "areas": [
          "Lugari",
          "Chetambe Hills",
          "Mautuma",
          "Eldoret (bordering areas)",
          "Kakamega County (bordering areas)",
          "Trans Nzoia County (bordering areas)"
        ]
      },
          {
        "town": "Chetambe",
        "areas": [
          "Chetambe Town",
          "Chetambe Market",
          "Chetambe Hills"
        ]
      },
          {
        "town": "Mautuma",
        "areas": [
          "Mautuma Town",
          "Mautuma Market"
        ]
      },
          {
        "town": "Musikoma",
        "areas": [
          "Musikoma Town",
          "Musikoma Market"
        ]
      },
          {
        "town": "Mung'oma",
        "areas": [
          "Mung'oma Town",
          "Mung'oma Market"
        ]
      },
          {
        "town": "Sichei",
        "areas": [
          "Sichei Town",
          "Sichei Market"
        ]
      },
          {
        "town": "Marrel",
        "areas": [
          "Marrel Town",
          "Marrel Market"
        ]
      },
          {
        "town": "Bokoli",
        "areas": [
          "Bokoli Town",
          "Bokoli Market"
        ]
      },
          {
        "town": "Nalondo",
        "areas": [
          "Nalondo Town",
          "Nalondo Market"
        ]
      },
          {
        "town": "Lukhonge",
        "areas": [
          "Lukhonge Town",
          "Lukhonge Market"
        ]
      }
    ]
  },
  
  
  ]

router.get('/api/locations', (req, res) => {
  res.json(townsAndAreas);
});

module.exports = router;
