const express = require('express');
const router = express.Router();

const townsAndAreas = [
  { County: 'Nairobi', town: 'Rongai', areas: ['Bomas', 'Maasai Lodge', 'Tumaini', 'Kware', 'Rimpa', 'Gataka', 'Mericho', 'Acacia Estate', 'Laiser Hill' ]},
  { County: 'Kiambu', town: 'Thika Road', areas: ['Allsops', 'Kahawa West', 'Kahawa Sukari', 'Kahawa Wendani', 'Roysambu', 'Zimmerman', 'Juja', 'Ruiru', 'Githurai', 'Witeithie' ]},
  { County: 'Kiambu', town: 'Thika', areas: ['Ngoingwa', 'Makongeni', 'Juja', 'Gatundu', 'Kiganjo', 'Muguga', 'Kenyatta Road', 'Kiboko', 'Kisii', 'Landless', 'Section 9', 'Section 2', 'Kamenu', 'Pilot Estate', 'Kilimambogo', 'Munene Estate', 'Central Business District' ] },
  { County: 'Nairobi', town: 'Nairobi', areas: ['Westlands', 'Kilimani', 'Kasarani', 'Karen', 'Langata', 'Roysambu', 'Eastleigh', 'Embakasi', 'Lavington', 'Ngong Road', 'Kayole', 'Dandora', 'Dagoretti', 'Pumwani', 'Pangani', 'Donholm', 'Umoja', 'Komarock', 'Buru-Buru', 'Makadara', 'Industrial Area', 'KCA Area', 'Ngara', 'Allsops', 'Pipeline', 'Huruma', 'Parklands', 'Runda', 'Gigiri', 'Muthaiga', 'Thome', 'Roysambu', 'Zimmerman', 'Githurai', 'South B', 'South C', 'Imara Daima', 'Syokimau', 'Mlolongo', 'Kileleshwa', 'Lavington', 'Riverside', 'Spring Valley', 'Kyuna'] },
  { County: 'Mombasa', town: 'Mombasa', areas: ['Nyali', 'Bamburi', 'Mvita', 'Likoni', 'Changamwe', 'Kisauni', 'Shanzu', 'Mtwapa', 'Tudor', 'Port Reitz',  "Jomvu",] },
  { County: 'Muranga', town: 'Muranga', areas: ['Delview', 'Kabati','kenol', 'Sabasaba', 'Maragua', 'Muranga Town', 'Mukuyu', 'Makuyu', 'Kandara' ]},
  { County: 'Kisumu', town: 'Kisumu', areas: ['Milimani', 'Ahero ', 'Nyalenda', 'Manyatta', 'Mamboleo', 'Lolwe', 'Tom Mboya', 'Obunga', 'Dunga', 'Kibos', 'Ojolla'] },
  { County: 'Nakuru', town: 'Nakuru', areas: ['Milimani', 'Langalanga', 'Shabab', 'Kiti', 'Free Area', 'Naka', 'Mwariki', 'Lanet', 'Rhonda', 'Bondeni'] },
  { County: 'Eldoret', town: 'Eldoret', areas: ['Langas', 'Kapsoya', 'Munyaka', 'Elgon View', 'Huruma', 'Kimumu', 'Pioneer', 'Sosiani', 'Kipkaren', 'Racecourse'] },
  { County: 'Nyeri', town: 'Nyeri', areas: ['Karatina', 'Othaya', 'Nyeri Town', 'Kieni', 'Naro Moru', 'chaka', 'Kamakwa', 'Mukurwe-ini', 'Mathira', 'Ruringu', 'Kamakwa', 'Kangemi', 'King\'ong\'o', 'Gatitu', 'Kiganjo', 'Skuta', 'Ragati', 'Ngangarithi', 'Majengo'] },
  { County: 'Machakos', town: 'Machakos', areas: ['Machakos town', 'Mua Hills', 'Katoloni', 'Kangundo', 'Mlolongo', 'Athi River', 'Wamunyu', 'Kyumbi', 'Kaseve', 'Masinga', 'Kithimani'] },
  { County: 'Meru', town: 'Meru', areas: ['Makutano', 'Gakoromone', 'Kaaga', 'Kinoru', 'Kithoka', 'Mitunguu', 'Nkubu', 'Timau', 'Chogoria', 'Kionyo'] },
  { County: 'Kakamenga', town: 'Kakamega', areas: ['Lurambi', 'Shinyalu', 'Navakholo', 'Butere', 'Mumias', 'Ilesi', 'Khayega', 'Malava', 'Ikolomani', 'Likuyani'] },
  { County: 'Embu', town: 'Embu', areas: ['Blue Valley', 'Kirimari', 'Dallas', 'Itabua', 'Njukiri', 'Kianjokoma', 'Kairuri', 'Runyenjes', 'Siakago', 'Karurumo'] },
  { County: 'Garissa', town: 'Garissa', areas: ['Bura', 'Dadaab', 'Modogashe', 'Hulugho', 'Iftin', 'Korakora', 'Sankuri', 'Mbalambala', 'Burtile', 'Nanighi'] },
  { County: 'Kericho', town: 'Kericho', areas: ['Kericho Town', 'Kapsoit', 'Litein', 'Chepseon', 'Brooke', 'Roret', 'Kipkelion', 'Sigowet', 'Kabianga', 'Sosiot'] },
  { County: 'Trans-zoia', town: 'Kitale', areas: ['Milimani', 'Tuwani', 'Matisi', 'Kipsongo', 'Bikeke', 'Makutano', 'Bidii', 'Kwanza', 'Saboti', 'Sikhendu'] },
  { County: 'Malindi',  town: 'Malindi', areas: ['Watamu', 'Ganda', 'Gede', 'Shela', 'Langobaya', 'Marafa', 'Mambrui', 'Sabaki', 'Kakuyuni', 'Kijiwetanga'] },
  { County: 'Narok', town: 'Narok', areas: ['Ololulung\'a', 'Kilgoris', 'Emurua Dikirr', 'Ntulele', 'Nairagie Enkare', 'Mulot', 'Ewaso Ngiro', 'Sagamik', 'Maji Moto', 'Olchorro'] },
  { County: 'Naivasha', town: 'Naivasha', areas: ['Kongoni', 'Karagita', 'Mai Mahiu', 'Kayole', 'Karati', 'Kihoto', 'Mirera', 'Maraigushu', 'Kedong', 'Kongoni'] },
  { County: 'Nanyuki', town: 'Nanyuki', areas: ['Likii', 'Baraka', 'Riverside', 'Muthaiga', 'Sweetwaters', 'Tigithi', 'Nturukuma', 'Endana', 'Mugambi', 'Ngare Ndare'] },
  { County: 'Isiolo', town: 'Isiolo', areas: ['Kambi Garba', 'Wabera', 'Bulapesa', 'Kiwanjani', 'Ngare Mara', 'Oldonyiro', 'Merti', 'Garbatulla', 'Sericho', 'Burat'] },
  { County: 'Lamu', town: 'Lamu', areas: ['Shela', 'Mokowe', 'Hindi', 'Faza', 'Matondoni', 'Kizingitini', 'Pate', 'Witu', 'Kipungani', 'Manda'] },
  { County: 'Lodwar', town: 'Lodwar', areas: ['Nakwamekwi', 'Kanamkemer', 'Kerio', 'Kalokol', 'Kakuma', 'Lokichogio', 'Lokori', 'Lokitaung', 'Lowarengak', 'Turkwel'] },
  { County: 'Migori', town: 'Migori', areas: ['Awendo', 'Rongo', 'Kuria', 'Isebania', 'Macalder', 'Uriri', 'Masara', 'Suna', 'Nyatike', 'Muhuru Bay'] },
  { County: 'Molo', town: 'Molo', areas: ['Elburgon', 'Turi', 'Keringet', 'Mau Summit', 'Kamara', 'Njoro', 'Total', 'Mau Narok', 'Nessuit', 'Mariashoni'] },
  { County: 'Voi', town: 'Voi', areas: ['Ikanga', 'Kasigau', 'Mzima Springs', 'Sagala', 'Ndara', 'Mbololo', 'Wundanyi', 'Bura', 'Mwatate', 'Taveta'] },
  { County: 'Wajir', town: 'Wajir', areas: ['Griftu', 'Eldas', 'Tarbaj', 'Habaswein', 'Bute', 'Buna', 'Khorof Harar', 'Dadajabula', 'Leheley', 'Gurar'] },
  { County: 'Marsabit', town: 'Marsabit', areas: ['Moyale', 'Sololo', 'North Horr', 'Loiyangalani', 'Kargi', 'Laisamis', 'Korr', 'Illeret', 'Maikona', 'Dukana'] },
  { County: 'Bomet', town: 'Bomet', areas: ['Kaplong', 'Sotik', 'Longisa', 'Ndanai', 'Mulot', 'Sigor', 'Chebunyo', 'Kipreres', 'Kimulot', 'Mogogosiek'] },
  { County: 'Bungoma', town: 'Bungoma', areas: ['Webuye', 'Kimilili', 'Chwele', 'Bokoli', 'Lugulu', 'Naitiri', 'Kanduyi', 'Kibabii', 'Misikhu', 'Khalaba'] },
  { County: 'Busia', town: 'Busia', areas: ['Nambale', 'Matayos', 'Funyula', 'Butula', 'Port Victoria', 'Samia', 'Sio Port', 'Amukura', 'Bunyala', 'Malaba'] },
  { County: 'Nyeri', town: 'Chuka', areas: ['Karingani', 'Magumoni', 'Maara', 'Kaanwa', 'Karingani', 'Ithwana', 'Mitheru', 'Igambang\'ombe', 'Kamwimbi', 'Kiamwathi'] },
  { County: 'Kajiado', town: 'Kajiado', areas: ['Ngong', 'Ongata Rongai', 'Kitengela', 'Isinya', 'Namanga', 'Loitokitok', 'Mashuuru', 'Sultan Hamud', 'Kimana', 'Kiserian'] },
  { County: 'Turkana', town: 'Kapenguria', areas: ['Chepareria', 'Kacheliba', 'Sigor', 'Ortum', 'Kodich', 'Kapsait', 'Lelan', 'Sook', 'Alale', 'Mnagei'] },
  { County: 'Kisii', town: 'Kisii', areas: ['Suneka', 'Ogembo', 'Kenyenya', 'Nyamarambe', 'Kisii Town', 'Keroka', 'Keumbu', 'Nyatieko', 'Mosocho', 'Nyamache'] },
  { County: 'Kwale', town: 'Kwale', areas: ['Ukunda', 'Diani', 'Msambweni', 'Kinango', 'Lunga Lunga', 'Shimoni', 'Matuga', 'Tiwi', 'Kibuyuni', 'Magutu'] },
  { County: 'Kakamenga', town: 'Malava', areas: ['Matunda', 'Lugari', 'Mukhonje', 'Kakamega', 'Matioli', 'Malava Town', 'Munduli', 'Milando', 'Shamakhokho', 'Sango'] },
  { County: 'Mandera', town: 'Mandera', areas: ["Banisa", "Arabia", "Lafey", "Elwak", "Mandera Town", "Fafi", "Takaba", "Bula Hawa", "Dandu", "Dolo"] },
  { County: 'Siaya', town: "Siaya", areas: ["Siaya Town", "Bondo", "Ugunja", "Usenge", "Yala", "Asembo", "Rarieda", "Nyadorera", "Ndori", "Sidindi", "Uholo", "Alego"] },
  { County: 'Uasin Gishu', town: 'Uasin Gishu', areas: ['Eldoret Town', "Kimumu", 'Turbo', 'Moiben', 'Kesses', 'Ziwa', 'Kapseret', "Elgon View", 'Kapsoya', 'Langas', "Annex", 'Kipkabus', "Outspan", "Huruma", "Chepkoilel", "Racecourse", "Pioneer", 'Matiang\'i'] },
];


router.get('/api/locations', (req, res) => {
  res.json(townsAndAreas);
});

module.exports = router;
