const express = require('express');
const router = express.Router();

const townsAndAreas = [
  { town: 'Thika', areas: ['Ngoingwa-route', 'Makongeni-route', 'Juja-route', 'Ruiru-route', 'Gatundu-route', 'Kiganjo-route', 'Muguga-route', 'Kenyatta Road -route', 'Kiboko-route', 'Kandara-route'] },
  { town: 'Nairobi', areas: ['Westlands-route', 'Kilimani-route', 'Kasarani-route', 'Karen-route', 'Langata-route', 'Roysambu-route', 'Eastleigh-route', 'Embakasi-route', 'Lavington-route', 'Ngong Road-route'] },
  { town: 'Mombasa', areas: ['Nyali-route', 'Bamburi-route', 'Mvita-route', 'Likoni-route', 'Changamwe-route', 'Kisauni-route', 'Shanzu-route', 'Mtwapa-route', 'Tudor-route', 'Port Reitz-route'] },
  { town: 'Kisumu', areas: ['Milimani-route', 'Nyalenda-route', 'Manyatta-route', 'Mamboleo-route', 'Lolwe-route', 'Tom Mboya-route', 'Obunga-route', 'Dunga-route', 'Kibos-route', 'Ojolla-route'] },
  { town: 'Nakuru', areas: ['Milimani-route', 'Langalanga-route', 'Shabab-route', 'Kiti-route', 'Free Area-route', 'Naka-route', 'Mwariki-route', 'Lanet-route', 'Rhonda-route', 'Bondeni-route'] },
  { town: 'Eldoret', areas: ['Langas-route', 'Kapsoya-route', 'Munyaka-route', 'Elgon View-route', 'Huruma-route', 'Kimumu-route', 'Pioneer-route', 'Sosiani-route', 'Kipkaren-route', 'Racecourse-route'] },
  { town: 'Nyeri', areas: ['Ruringu-route', 'Kamakwa-route', 'Kangemi-route', 'King\'ong\'o-route', 'Gatitu-route', 'Kiganjo-route', 'Skuta-route', 'Ragati-route', 'Ngangarithi-route', 'Majengo-route'] },
  { town: 'Machakos', areas: ['Mua Hills-route', 'Katoloni-route', 'Kangundo-route', 'Mlolongo-route', 'Athi River-route', 'Wamunyu-route', 'Kyumbi-route', 'Kaseve-route', 'Masinga-route', 'Kithimani-route'] },
  { town: 'Meru', areas: ['Makutano-route', 'Gakoromone-route', 'Kaaga-route', 'Kinoru-route', 'Kithoka-route', 'Mitunguu-route', 'Nkubu-route', 'Timau-route', 'Chogoria-route', 'Kionyo-route'] },
  { town: 'Kakamega', areas: ['Lurambi-route', 'Shinyalu-route', 'Navakholo-route', 'Butere-route', 'Mumias-route', 'Ilesi-route', 'Khayega-route', 'Malava-route', 'Ikolomani-route', 'Likuyani-route'] },
  { town: 'Embu', areas: ['Blue Valley-route', 'Kirimari-route', 'Dallas-route', 'Itabua-route', 'Njukiri-route', 'Kianjokoma-route', 'Kairuri-route', 'Runyenjes-route', 'Siakago-route', 'Karurumo-route'] },
  { town: 'Garissa', areas: ['Bura-route', 'Dadaab-route', 'Modogashe-route', 'Hulugho-route', 'Iftin-route', 'Korakora-route', 'Sankuri-route', 'Mbalambala-route', 'Burtile-route', 'Nanighi-route'] },
  { town: 'Kericho', areas: ['Kericho Town-route', 'Kapsoit-route', 'Litein-route', 'Chepseon-route', 'Brooke-route', 'Roret-route', 'Kipkelion-route', 'Sigowet-route', 'Kabianga-route', 'Sosiot-route'] },
  { town: 'Kitale', areas: ['Milimani-route', 'Tuwani-route', 'Matisi-route', 'Kipsongo-route', 'Bikeke-route', 'Makutano-route', 'Bidii-route', 'Kwanza-route', 'Saboti-route', 'Sikhendu-route'] },
  { town: 'Malindi', areas: ['Watamu-route', 'Ganda-route', 'Gede-route', 'Shela-route', 'Langobaya-route', 'Marafa-route', 'Mambrui-route', 'Sabaki-route', 'Kakuyuni-route', 'Kijiwetanga-route'] },
  { town: 'Narok', areas: ['Ololulung\'a-route', 'Kilgoris-route', 'Emurua Dikirr-route', 'Ntulele-route', 'Nairagie Enkare-route', 'Mulot-route', 'Ewaso Ngiro-route', 'Sagamik-route', 'Maji Moto-route', 'Olchorro-route'] },
  { town: 'Naivasha', areas: ['Kongoni-route', 'Karagita-route', 'Mai Mahiu-route', 'Kayole-route', 'Karati-route', 'Kihoto-route', 'Mirera-route', 'Maraigushu-route', 'Kedong-route', 'Kongoni-route'] },
  { town: 'Nanyuki', areas: ['Likii-route', 'Baraka-route', 'Riverside-route', 'Muthaiga-route', 'Sweetwaters-route', 'Tigithi-route', 'Nturukuma-route', 'Endana-route', 'Mugambi-route', 'Ngare Ndare-route'] },
  { town: 'Isiolo', areas: ['Kambi Garba-route', 'Wabera-route', 'Bulapesa-route', 'Kiwanjani-route', 'Ngare Mara-route', 'Oldonyiro-route', 'Merti-route', 'Garbatulla-route', 'Sericho-route', 'Burat-route'] },
  { town: 'Lamu', areas: ['Shela-route', 'Mokowe-route', 'Hindi-route', 'Faza-route', 'Matondoni-route', 'Kizingitini-route', 'Pate-route', 'Witu-route', 'Kipungani-route', 'Manda-route'] },
  { town: 'Lodwar', areas: ['Nakwamekwi-route', 'Kanamkemer-route', 'Kerio-route', 'Kalokol-route', 'Kakuma-route', 'Lokichogio-route', 'Lokori-route', 'Lokitaung-route', 'Lowarengak-route', 'Turkwel-route'] },
  { town: 'Migori', areas: ['Awendo-route', 'Rongo-route', 'Kuria-route', 'Isebania-route', 'Macalder-route', 'Uriri-route', 'Masara-route', 'Suna-route', 'Nyatike-route', 'Muhuru Bay-route'] },
  { town: 'Molo', areas: ['Elburgon-route', 'Turi-route', 'Keringet-route', 'Mau Summit-route', 'Kamara-route', 'Njoro-route', 'Total-route', 'Mau Narok-route', 'Nessuit-route', 'Mariashoni-route'] },
  { town: 'Voi', areas: ['Ikanga-route', 'Kasigau-route', 'Mzima Springs-route', 'Sagala-route', 'Ndara-route', 'Mbololo-route', 'Wundanyi-route', 'Bura-route', 'Mwatate-route', 'Taveta-route'] },
  { town: 'Wajir', areas: ['Griftu-route', 'Eldas-route', 'Tarbaj-route', 'Habaswein-route', 'Bute-route', 'Buna-route', 'Khorof Harar-route', 'Dadajabula-route', 'Leheley-route', 'Gurar-route'] },
  { town: 'Marsabit', areas: ['Moyale-route', 'Sololo-route', 'North Horr-route', 'Loiyangalani-route', 'Kargi-route', 'Laisamis-route', 'Korr-route', 'Illeret-route', 'Maikona-route', 'Dukana-route'] },
  { town: 'Bomet', areas: ['Kaplong-route', 'Sotik-route', 'Longisa-route', 'Ndanai-route', 'Mulot-route', 'Sigor-route', 'Chebunyo-route', 'Kipreres-route', 'Kimulot-route', 'Mogogosiek-route'] },
  { town: 'Bungoma', areas: ['Webuye-route', 'Kimilili-route', 'Chwele-route', 'Bokoli-route', 'Lugulu-route', 'Naitiri-route', 'Kanduyi-route', 'Kibabii-route', 'Misikhu-route', 'Khalaba-route'] },
  { town: 'Busia', areas: ['Nambale-route', 'Matayos-route', 'Funyula-route', 'Butula-route', 'Port Victoria-route', 'Samia-route', 'Sio Port-route', 'Amukura-route', 'Bunyala-route', 'Malaba-route'] },
  { town: 'Chuka', areas: ['Karingani-route', 'Magumoni-route', 'Maara-route', 'Kaanwa-route', 'Karingani-route', 'Ithwana-route', 'Mitheru-route', 'Igambang\'ombe-route', 'Kamwimbi-route', 'Kiamwathi-route'] },
  { town: 'Kajiado', areas: ['Ngong-route', 'Ongata Rongai-route', 'Kitengela-route', 'Isinya-route', 'Namanga-route', 'Loitokitok-route', 'Mashuuru-route', 'Sultan Hamud-route', 'Kimana-route', 'Kiserian-route'] },
  { town: 'Kapenguria', areas: ['Chepareria-route', 'Kacheliba-route', 'Sigor-route', 'Ortum-route', 'Kodich-route', 'Kapsait-route', 'Lelan-route', 'Sook-route', 'Alale-route', 'Mnagei-route'] },
  { town: 'Kisii', areas: ['Suneka-route', 'Ogembo-route', 'Kenyenya-route', 'Nyamarambe-route', 'Kisii Town-route', 'Keroka-route', 'Keumbu-route', 'Nyatieko-route', 'Mosocho-route', 'Nyamache-route'] },
  { town: 'Kwale', areas: ['Ukunda-route', 'Diani-route', 'Msambweni-route', 'Kinango-route', 'Lunga Lunga-route', 'Shimoni-route', 'Matuga-route', 'Tiwi-route', 'Kibuyuni-route', 'Magutu-route'] },
  { town: 'Malava', areas: ['Matunda-route', 'Lugari-route', 'Mukhonje-route', 'Kakamega-route', 'Matioli-route', 'Malava Town-route', 'Munduli-route', 'Milando-route', 'Shamakhokho-route', 'Sango-route'] },
  { town: 'Mandera', areas: ['Banisa-route', 'Arabia-route', 'Lafey-route', 'Elwak-route', 'Mandera Town-route', 'Fafi-route', 'Takaba-route', 'Bula Hawa-route', 'Dandu-route', 'Dolo-route'] },
  { town: 'Siaya', areas: ['Siaya Town-route', 'Ugunja-route', 'Bondo-route', 'Alego Usonga-route', 'Gem-route', 'Yala-route', 'Kagelo-route', 'Wagai-route', 'Siyu-route', 'Ugunja-route'] },
  { town: 'Uasin Gishu', areas: ['Eldoret-route', 'Turbo-route', 'Moiben-route', 'Kesses-route', 'Ziwa-route', 'Kapseret-route', 'Kapsaret-route', 'Langas-route', 'Kipkabus-route', 'Matiang\'i-route'] },
];


router.get('/api/locationsroutes', (req, res) => {
  res.json(townsAndAreas);
});

module.exports = router;
