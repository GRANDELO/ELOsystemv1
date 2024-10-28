const express = require('express');
const router = express.Router();

const townsAndAreas = [
  { town: 'Thika', areas: ['Ngoingwa', 'Makongeni', 'Juja', 'Ruiru', 'Gatundu', 'Kiganjo', 'Muguga', 'Kenyatta Road', 'Kiboko', 'Kandara'] },
  { town: 'Nairobi', areas: ['Westlands', 'Kilimani', 'Kasarani', 'Karen', 'Langata', 'Roysambu', 'Eastleigh', 'Embakasi', 'Lavington', 'Ngong Road'] },
  { town: 'Mombasa', areas: ['Nyali', 'Bamburi', 'Mvita', 'Likoni', 'Changamwe', 'Kisauni', 'Shanzu', 'Mtwapa', 'Tudor', 'Port Reitz'] },
  { town: 'Kisumu', areas: ['Milimani', 'Nyalenda', 'Manyatta', 'Mamboleo', 'Lolwe', 'Tom Mboya', 'Obunga', 'Dunga', 'Kibos', 'Ojolla'] },
  { town: 'Nakuru', areas: ['Milimani', 'Langalanga', 'Shabab', 'Kiti', 'Free Area', 'Naka', 'Mwariki', 'Lanet', 'Rhonda', 'Bondeni'] },
  { town: 'Eldoret', areas: ['Langas', 'Kapsoya', 'Munyaka', 'Elgon View', 'Huruma', 'Kimumu', 'Pioneer', 'Sosiani', 'Kipkaren', 'Racecourse'] },
  { town: 'Nyeri', areas: ['Ruringu', 'Kamakwa', 'Kangemi', 'King\'ong\'o', 'Gatitu', 'Kiganjo', 'Skuta', 'Ragati', 'Ngangarithi', 'Majengo'] },
  { town: 'Machakos', areas: ['Mua Hills', 'Katoloni', 'Kangundo', 'Mlolongo', 'Athi River', 'Wamunyu', 'Kyumbi', 'Kaseve', 'Masinga', 'Kithimani'] },
  { town: 'Meru', areas: ['Makutano', 'Gakoromone', 'Kaaga', 'Kinoru', 'Kithoka', 'Mitunguu', 'Nkubu', 'Timau', 'Chogoria', 'Kionyo'] },
  { town: 'Kakamega', areas: ['Lurambi', 'Shinyalu', 'Navakholo', 'Butere', 'Mumias', 'Ilesi', 'Khayega', 'Malava', 'Ikolomani', 'Likuyani'] },
  { town: 'Embu', areas: ['Blue Valley', 'Kirimari', 'Dallas', 'Itabua', 'Njukiri', 'Kianjokoma', 'Kairuri', 'Runyenjes', 'Siakago', 'Karurumo'] },
  { town: 'Garissa', areas: ['Bura', 'Dadaab', 'Modogashe', 'Hulugho', 'Iftin', 'Korakora', 'Sankuri', 'Mbalambala', 'Burtile', 'Nanighi'] },
  { town: 'Kericho', areas: ['Kericho Town', 'Kapsoit', 'Litein', 'Chepseon', 'Brooke', 'Roret', 'Kipkelion', 'Sigowet', 'Kabianga', 'Sosiot'] },
  { town: 'Kitale', areas: ['Milimani', 'Tuwani', 'Matisi', 'Kipsongo', 'Bikeke', 'Makutano', 'Bidii', 'Kwanza', 'Saboti', 'Sikhendu'] },
  { town: 'Malindi', areas: ['Watamu', 'Ganda', 'Gede', 'Shela', 'Langobaya', 'Marafa', 'Mambrui', 'Sabaki', 'Kakuyuni', 'Kijiwetanga'] },
  { town: 'Narok', areas: ['Ololulung\'a', 'Kilgoris', 'Emurua Dikirr', 'Ntulele', 'Nairagie Enkare', 'Mulot', 'Ewaso Ngiro', 'Sagamik', 'Maji Moto', 'Olchorro'] },
  { town: 'Naivasha', areas: ['Kongoni', 'Karagita', 'Mai Mahiu', 'Kayole', 'Karati', 'Kihoto', 'Mirera', 'Maraigushu', 'Kedong', 'Kongoni'] },
  { town: 'Nanyuki', areas: ['Likii', 'Baraka', 'Riverside', 'Muthaiga', 'Sweetwaters', 'Tigithi', 'Nturukuma', 'Endana', 'Mugambi', 'Ngare Ndare'] },
  { town: 'Isiolo', areas: ['Kambi Garba', 'Wabera', 'Bulapesa', 'Kiwanjani', 'Ngare Mara', 'Oldonyiro', 'Merti', 'Garbatulla', 'Sericho', 'Burat'] },
  { town: 'Lamu', areas: ['Shela', 'Mokowe', 'Hindi', 'Faza', 'Matondoni', 'Kizingitini', 'Pate', 'Witu', 'Kipungani', 'Manda'] },
  { town: 'Lodwar', areas: ['Nakwamekwi', 'Kanamkemer', 'Kerio', 'Kalokol', 'Kakuma', 'Lokichogio', 'Lokori', 'Lokitaung', 'Lowarengak', 'Turkwel'] },
  { town: 'Migori', areas: ['Awendo', 'Rongo', 'Kuria', 'Isebania', 'Macalder', 'Uriri', 'Masara', 'Suna', 'Nyatike', 'Muhuru Bay'] },
  { town: 'Molo', areas: ['Elburgon', 'Turi', 'Keringet', 'Mau Summit', 'Kamara', 'Njoro', 'Total', 'Mau Narok', 'Nessuit', 'Mariashoni'] },
  { town: 'Voi', areas: ['Ikanga', 'Kasigau', 'Mzima Springs', 'Sagala', 'Ndara', 'Mbololo', 'Wundanyi', 'Bura', 'Mwatate', 'Taveta'] },
  { town: 'Wajir', areas: ['Griftu', 'Eldas', 'Tarbaj', 'Habaswein', 'Bute', 'Buna', 'Khorof Harar', 'Dadajabula', 'Leheley', 'Gurar'] },
  { town: 'Marsabit', areas: ['Moyale', 'Sololo', 'North Horr', 'Loiyangalani', 'Kargi', 'Laisamis', 'Korr', 'Illeret', 'Maikona', 'Dukana'] },
  { town: 'Bomet', areas: ['Kaplong', 'Sotik', 'Longisa', 'Ndanai', 'Mulot', 'Sigor', 'Chebunyo', 'Kipreres', 'Kimulot', 'Mogogosiek'] },
  { town: 'Bungoma', areas: ['Webuye', 'Kimilili', 'Chwele', 'Bokoli', 'Lugulu', 'Naitiri', 'Kanduyi', 'Kibabii', 'Misikhu', 'Khalaba'] },
  { town: 'Busia', areas: ['Nambale', 'Matayos', 'Funyula', 'Butula', 'Port Victoria', 'Samia', 'Sio Port', 'Amukura', 'Bunyala', 'Malaba'] },
  { town: 'Chuka', areas: ['Karingani', 'Magumoni', 'Maara', 'Kaanwa', 'Karingani', 'Ithwana', 'Mitheru', 'Igambang\'ombe', 'Kamwimbi', 'Kiamwathi'] },
  { town: 'Kajiado', areas: ['Ngong', 'Ongata Rongai', 'Kitengela', 'Isinya', 'Namanga', 'Loitokitok', 'Mashuuru', 'Sultan Hamud', 'Kimana', 'Kiserian'] },
  { town: 'Kapenguria', areas: ['Chepareria', 'Kacheliba', 'Sigor', 'Ortum', 'Kodich', 'Kapsait', 'Lelan', 'Sook', 'Alale', 'Mnagei'] },
  { town: 'Kisii', areas: ['Suneka', 'Ogembo', 'Kenyenya', 'Nyamarambe', 'Kisii Town', 'Keroka', 'Keumbu', 'Nyatieko', 'Mosocho', 'Nyamache'] },
  { town: 'Kwale', areas: ['Ukunda', 'Diani', 'Msambweni', 'Kinango', 'Lunga Lunga', 'Shimoni', 'Matuga', 'Tiwi', 'Kibuyuni', 'Magutu'] },
  { town: 'Malava', areas: ['Matunda', 'Lugari', 'Mukhonje', 'Kakamega', 'Matioli', 'Malava Town', 'Munduli', 'Milando', 'Shamakhokho', 'Sango'] },
  { town: 'Mandera', areas: ['Banisa', 'Arabia', 'Lafey', 'Elwak', 'Mandera Town', 'Fafi', 'Takaba', 'Bula Hawa', 'Dandu', 'Dolo'] },
  { town: 'Siaya', areas: ['Siaya Town', 'Ugunja', 'Bondo', 'Alego Usonga', 'Gem', 'Yala', 'Kagelo', 'Wagai', 'Siyu', 'Ugunja'] },
  { town: 'Uasin Gishu', areas: ['Eldoret', 'Turbo', 'Moiben', 'Kesses', 'Ziwa', 'Kapseret', 'Kapsaret', 'Langas', 'Kipkabus', 'Matiang\'i'] },
];


router.get('/api/locations', (req, res) => {
  res.json(townsAndAreas);
});

module.exports = router;
