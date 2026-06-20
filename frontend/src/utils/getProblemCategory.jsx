const TYPE_TO_CATEGORY = {
  'Tvarkymo ir švaros taisyklių pažeidimas': 'violationReports',
  'Transporto stovėjimo  pažeidimai': 'violationReports',
  'Triukšmo taisyklių pažeidimas': 'violationReports',
  'Neeksploatuojami automobiliai': 'violationReports',
  'Reklamos pažeidimai': 'violationReports',
  'Grafičiai': 'violationReports',

  'Gatvių apšvietimas': 'trafficReports',
  'Eismo organizavimo priemonės': 'trafficReports',
  'Viešasis transportas': 'trafficReports',
  'Šviesoforai': 'trafficReports',

  'Beglobių gyvūnų gaudymas': 'animalReports',
  'Rasti gyvūnai': 'animalReports',
  'Gyvūnų laikymas': 'animalReports',

  'Komunalinės atliekos': 'enviromentalRepairs',
  'Želdynų priežiūra': 'enviromentalRepairs',
  'Vaikų žaidimo aikštelės': 'enviromentalRepairs',
  'Teritorijų tvarkymas': 'enviromentalRepairs',
  'Sporto aikštelės, treniruokliai': 'enviromentalRepairs',
  'Suolelių, šiukšliadėžių, paminklų, adresų lentelių priežiūra': 'enviromentalRepairs',
  'Kapinių priežiūra': 'enviromentalRepairs',

  'Žvyrkeliai': 'pavementRepairs',
  'Laiptai': 'pavementRepairs',
  'Šaligatvių remontas': 'pavementRepairs',
  'Gatvių remontas': 'pavementRepairs',
  'Kiemų dangos remontas': 'pavementRepairs',
  'Duobės, įgriuvos, šuliniai': 'pavementRepairs',
  'Dviračių takai': 'pavementRepairs',
  'Susisiekimo statiniai' : 'pavementRepairs',  

  'Apšvietimo gedimai': 'lightingRepairs',

  'Pastatų administravimas': 'buildingReports',
  'Statinių priežiūra': 'buildingReports',

  'Šaligatvių valymas': 'seasonalReports',
  'Stotelių valymas': 'seasonalReports',
  'Daugiabučių namų kiemų valymas': 'seasonalReports',
  'Gatvių valymas': 'seasonalReports',
};

export function getProblemCategory(problemTypeString) {
  return TYPE_TO_CATEGORY[problemTypeString] ?? 'allReports';
}
