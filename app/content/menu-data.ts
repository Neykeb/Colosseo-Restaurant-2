export type MenuDish = {
  key: string;
  number: string;
  name: string;
  allergens?: string;
  description?: string;
  price: string;
};

export type MenuSection = {
  id: string;
  heading: string;
  subheading?: string;
  note?: string;
  dishes: MenuDish[];
};

export type MenuCategory = {
  id: string;
  filterLabel: string;
  sections: MenuSection[];
};

const dish = (key: string, number: string, name: string, allergens: string | undefined, description: string | undefined, price: string): MenuDish => ({ key, number, name, allergens, description, price });

const lunchSoups = [
  dish("lunch-20", "20", "STRACCIATELLA ALLA ROMANA", "(a, c, i, j, g)", "Kraftbrühe mit legiertem Ei und Parmesan", "4,90 €"),
  dish("lunch-21", "21", "CREMA DI POMODORO", "(a, c, i, j, g, 2, 3)", "Tomatencremesuppe", "4,90 €"),
  dish("lunch-22", "22", "TORTELLINI IN BRODO", "(a, c, e, i, j, g, 4)", "Gefüllte Nudeln in Kraftbrühe", "4,90 €"),
];

const lunchPasta = [
  dish("lunch-40", "40", "SPAGHETTI NAPOLI", "(a, c, g, h, 2, 3)", "mit Tomatensauce", "9,00 €"),
  dish("lunch-43", "43", "SPAGHETTI BOLOGNESE", "(a, c, g, h, i, l, 2, 3)", "mit Sauce Bolognese", "9,00 €"),
  dish("lunch-45", "45", "SPAGHETTI ALL AMATRICIANA", "(a, c, i, g, h, 2, 3)", "mit Speck, Zwiebeln, Knoblauch, Basilikum in pikanter Tomatensauce", "9,00 €"),
  dish("lunch-44", "44", "SPAGHETTI CARBONARA", "(a, c, d, g, h, i, 2, 3)", "mit Speck, Eiern, Sahne und Parmesan, Schinken", "9,00 €"),
  dish("lunch-46", "46", "SPAGHETTI ALLA CARRETTIERA", "(a, c, g, h)", "mit Schinken, Pilzen, Paprika, Sahne und Tomatensauce", "9,00 €"),
  dish("lunch-47", "47", "SPAGHETTI DELLO CHEF", "(a, c, d, g, h)", "nach Art des Chefs", "9,00 €"),
  dish("lunch-51", "51", "PENNE ALL´ARRABBIATA", "(a, g, h)", "Makkaroni in pikanter Tomatensauce mit Knoblauch und Petersilie", "9,00 €"),
  dish("lunch-56", "56", "PENNE VALENTINO", "(a, c, g, h)", "Makkaroni mit Auberginen, Knoblauch, Tomatensauce, Mozzarella, überbacken mit Parmesan", "9,00 €"),
  dish("lunch-55", "55", "PENNE BANDIERA", "(a, c, g, h)", "Makkaroni mit Blattspinat, Knoblauch und Mozzarella in Tomatensauce", "9,00 €"),
  dish("lunch-61", "61", "TAGLIATELLE AL SALMONE", "(a, c, d, g, h)", "Bandnudeln mit Lachssauce", "9,90 €"),
  dish("lunch-48", "48", "SPAGHETTI CREOLA", "(a, b, c, d, g, h)", "Spaghetti mit Shrimps und Knoblauch in Tomatensahnesauce", "9,90 €"),
  dish("lunch-63", "63", "TORTELLINI CON SPINACI E GORGONZOLA", "(a, b, c, d, e, g, i, 2, 3)", "Tortellini (mit Fleisch gefüllt) mit Spinat in Gorgonzola-Sahnesauce", "9,90 €"),
  dish("lunch-52", "52", "PENNE ALLA SICILIANA", "(a, g, 2, 3)", "Makkaroni mit Tomatensahnesauce, Paprika und Auberginen", "9,00 €"),
  dish("lunch-54", "54", "PENNE ALLA SARACENO", "(a, g, i, 2, 3)", "Makkaroni mit Broccoli, Knoblauch und Tomatensahnesauce, überbacken", "9,00 €"),
  dish("lunch-62", "62", "TORTELLINI PANNA E PROSCIUTTO", "(a, b, c, d, e, g)", "Tortellini in Schinkensahnesauce mit Speck", "9,00 €"),
  dish("lunch-59", "59", "TAGLIATELLE BOSCAIOLA", "(a, c, d, g, h)", "Bandnudeln mit Champignons in Rahmsauce", "9,00 €"),
  dish("lunch-57", "57", "TAGLIATELLE FLAVIA", "(a, c, d, g, h)", "Bandnudeln in Schinkensahnesauce mit Speck", "9,00 €"),
  dish("lunch-60", "60", "TAGLIATELLE DELLA CASA", "(a, c, d, g, h)", "Bandnudeln mit Schinken und Speck, Pilzen und Erbsen in Tomatensahnesauce", "9,00 €"),
  dish("lunch-58", "58", "TAGLIATELLE MONTE ROSA", "(a,c,d,g,h,l)", "Bandnudeln mit Sauce Bolognese und Sahne", "9,00 €"),
  dish("lunch-64", "64", "CANNELONI AL FORNO", "(a, b, c, d, e, g, h)", "hausgemachte Nudeln mit Fleischfüllung, überbacken", "9,00 €"),
  dish("lunch-65", "65", "LASAGNE AL FORNO", "(a, c, g, h, i, d, 2, 3)", "Hausgemachte Schichtnudeln mit Fleischsauce, Schinken und Käse überbacken", "9,00 €"),
  dish("lunch-53", "53", "PENNE AL FORNO", "(a, f, g, i, 2, 3)", "Makkaroni mit Schinken, Speck, Pilzen, Tomatensahnesauce, mit Käse überbacken", "9,00 €"),
  dish("lunch-42", "42", "SPAGHETTI IN SALSA POVERA", "(a, g)", "Spaghetti mit Knoblauch und Tomatenstücken, in Olivenöl, auf Wunsch pikant", "9,00 €"),
  dish("lunch-41", "41", "SPAGHETTI AGLIO E OLIO", "(a, g)", "Spaghetti mit Knoblauch und Olivenöl", "9,00 €"),
];

const lunchPizza = [
  dish("lunch-70", "70", "PIZZA MARGHERITA", "(a, g, 2, 3)", "mit Käse und Tomatensauce", "9,00 €"),
  dish("lunch-73", "73", "PIZZA PROSCIUTTO", "(a, f, g, 2, 3)", "mit Tomatensauce, Käse und Schinken", "9,00 €"),
  dish("lunch-72", "72", "PIZZA SALAMI", "(a, g, 2, 3)", "mit Tomatensauce, Käse und Salami", "9,00 €"),
  dish("lunch-74", "74", "PIZZA FUNGHI", "(a, c, g, 2, 3)", "mit Tomatensauce, Käse und Champignons", "9,00 €"),
  dish("lunch-82", "82", "PIZZA VERDURA", "(a, g)", "mit Tomatensauce, Käse, Broccoli, Mais, Spargel und Knoblauch", "9,00 €"),
  dish("lunch-71", "71", "PIZZA NAPOLI", "(a, g)", "mit Tomatensauce, Käse, Knoblauch und Sardellen", "9,00 €"),
  dish("lunch-75", "75", "PIZZA TONNO", "(a, d, g, f, 2, 3)", "mit Tomatensauce, Käse und Thunfisch", "9,00 €"),
  dish("lunch-80", "80", "PIZZA QUATTRO STAGIONI", "(a, d, g, 2, 3)", "mit Tomatensauce, Käse, Thunfisch, Schinken, Champignons und Artischocken", "9,00 €"),
  dish("lunch-84", "84", "PIZZA CALZONE", "(a, g)", "Gefüllte Pizza nach Art des Hauses", "9,00 €"),
  dish("lunch-81", "81", "PIZZA O SOLE MIO", "(a, d, g, c, 2, 3)", "mit Tomatensauce, Käse, Champignons, Ei und Paprika", "9,00 €"),
  dish("lunch-79", "79", "PIZZA ROMANA", "(a, c, d, g)", "mit Tomatensauce, Käse, Schinken, Spargel und Ei", "9,00 €"),
  dish("lunch-76", "76", "PIZZA SICILIANA", "(a, g, l)", "mit Tomatensauce, Käse, Paprika, Sardellen und Kapern", "9,00 €"),
  dish("lunch-86", "86", "PIZZA BOLOGNESE", "(a, g, l)", "mit Käse, Sauce Bolognese, Schinken und Pilzen", "9,00 €"),
  dish("lunch-77", "77", "PIZZA PUGLIESE", "(a, g)", "mit Tomatensauce, Käse, Zwiebeln und milden (oder scharfen) Peperoni", "9,00 €"),
  dish("lunch-78", "78", "PIZZA HAWAII", "(a, g, 2, 3)", "mit Tomatensauce, Schinken, Käse und Ananas", "9,00 €"),
  dish("lunch-85", "85", "PIZZA CAPRICCIOSA", "(a, g, l, 3, 6)", "mit Tomatensauce, Käse, Artischocken, Schinken und Oliven", "9,00 €"),
  dish("lunch-87", "87", "PIZZA PESCATORE", "(a, b, d, g, n)", "mit Tomatensauce, Meeresfrüchten, Käse", "10,50 €"),
  dish("lunch-88", "88", "PIZZA ERICA", "(a, b, d, g, n)", "mit Tomatensauce, Käse und Krabben", "10,50 €"),
];

const antipastiFreddi = [
  dish("regular-11", "11", "MOZZARELLA CAPRESE", "(g, h)", "Tomaten, Mozzarella und Basilikum", "10,50 €"),
  dish("regular-12", "12", "GAMBERETTI IN SALSA AURORA", "(a, b, c, g, j)", "Krabbencocktail", "14,00 €"),
  dish("regular-13", "13", "PROSCIUTTO E MOZZARELLA", "(g, h)", "Parmaschinken mit Tomate und Mozzarella", "15,50 €"),
  dish("regular-14", "14", "CARPACCIO DI MANZO", "(g)", "Rinderfilet in hauchdünnen Scheiben mit Champignons und Parmesan", "14,50 €"),
  dish("regular-15", "15", "BRUSCHETTA", "(a)", undefined, "7,50 €"),
  dish("regular-16", "16", "ANTIPASTO-MIX", "(a, g, h)", "Mozzarella, Bruschetta und Parmesan", "10,50 €"),
];

const antipastiCaldi = [
  dish("regular-17", "17", "BROCCOLI AL FORNO", "(g)", "Broccoli mit Knoblauch und Béchamelsauce mit Käse überbacken", "10,50 €"),
  dish("regular-18", "18", "SPINACI AL FORNO", "(g)", "Spinat mit Knoblauch und Béchamelsauce mit Käse überbacken", "10,50 €"),
  dish("regular-19", "19", "TEGAMINO GAMBERETTI", "(b, g, l)", "Shrimps mit Weißwein, Knoblauch, Tomatensauce und Käse überbacken", "15,50 €"),
];

const soups = [
  dish("regular-20", "20", "STRACCIATELLA ALLA ROMANA", "(a, c, i, j, g)", "Kraftbrühe mit legiertem Ei und Parmesan", "6,30 €"),
  dish("regular-21", "21", "CREMA DI POMODORO", "(a, c, i, j, g, 2, 3)", "Tomatencremesuppe", "6,30 €"),
  dish("regular-22", "22", "TORTELLINI IN BRODO", "(a, c, i, j, g)", "Gefüllte Nudeln in Kraftbrühe", "6,30 €"),
];

const salads = [
  dish("regular-23", "23", "INSALATA DI POMODORI E CIPOLLE", undefined, "Tomatensalat mit Zwiebeln und Eisberg", "9,00 €"),
  dish("regular-24", "24", "INSALATA MISTA", "(2, 3)", "Gemischter Salat Eisberg, Zwiebeln, Rukola, Paprika,Tomaten, Gurken", "9,00 €"),
  dish("regular-25", "25", "INSALATA TONNO E CIPOLLA", "(d, f)", "Eisberg mit Thunfisch und Zwiebeln", "10,50 €"),
  dish("regular-26", "26", "INSALATA SANTA LUCIA", "(g)", "Tomaten, milde Peperoni, Mais und Mozzarella, Eisberg", "9,50 €"),
  dish("regular-27", "27", "INSALATA COLOSSEO", "(c, d, f, g)", "Salat nach Art des Hauses", "13,00 €"),
  dish("regular-28", "28", "INSALATA CAPRICCIOSA", "(b, c, f, g)", "Gemischter Salat mit Schinken, Oliven, Ei, Schafskäse und Krabben", "14,50 €"),
];

const pasta = [
  dish("regular-40", "40", "SPAGHETTI NAPOLI", "(a, c, g, h, 2, 3)", "Spaghetti in Tomatensauce", "10,50 €"),
  dish("regular-41", "41", "SPAGHETTI AGLIO E OLIO", "(a, g)", "Spaghetti mit Knoblauch und Olivenöl", "10,50 €"),
  dish("regular-42", "42", "SPAGHETTI IN SALSA POVERA", "(a, g)", "Spaghetti mit Knoblauch und Tomatenstücken in Olivenöl, pikant auf Wunsch", "11,50 €"),
  dish("regular-43", "43", "SPAGHETTI BOLOGNESE", "(a, c, g, h, i, l, 2, 3)", "Spaghetti in Fleischsauce", "12,00 €"),
  dish("regular-44", "44", "SPAGHETTI CARBONARA", "(a, c, d, h, g, i, 2, 3)", "Spaghetti mit Speck, Schinken, Ei, Sahne und Parmesan", "11,50 €"),
  dish("regular-45", "45", "SPAGHETTI ALL´AMATRICIANA", "(a, c, i, g, h, 3)", "Spaghetti mit Speck, Zwiebeln, Knoblauch und Basilikum in pikanter Tomatensauce", "11,50 €"),
  dish("regular-46", "46", "SPAGHETTI ALLA CARRETTIERA", "(a, c, g, h)", "Spaghetti mit Schinken, Speck, Pilzen, Paprika in Tomatensahnesauce", "12,50 €"),
  dish("regular-47", "47", "SPAGHETTI DELLO CHEF", "(a, c, d, g, h)", "Spaghetti mit Tomatensahnesauce und Fleischstücken", "13,00 €"),
  dish("regular-48", "48", "SPAGHETTI CREOLA", "(a, b, c, d, g, h)", "Spaghetti mit Shrimps und Knoblauch in Tomatensahnesauce", "14,50 €"),
  dish("regular-49", "49", "SPAGHETTI FRUTTI DI MARE", "(a, c, g, i, l, b, n, 2, 3)", "Spaghetti mit Meeresfrüchten", "17,50 €"),
  dish("regular-50", "50", "PENNE SCAMPI E SPINACI", "(a, b, d, g, n)", "Makkaroni mit kleinen Hummerkrabben, Knoblauch, Spinat in Tomatensahnesauce", "17,00 €"),
  dish("regular-51", "51", "PENNE ALL´ARRABIATA", "(a, g, h, 2, 3)", "Makkaroni in pikanter Tomatensauce mit Knoblauch und Petersilie", "10,50 €"),
  dish("regular-52", "52", "PENNE ALLA SICILIANA", "(a, g)", "Makkaroni mit Tomatensahnesauce, Paprika und Auberginen", "12,50 €"),
  dish("regular-53", "53", "PENNE AL FORNO", "(a, g, f, i, 2, 3)", "Makkaroni mit Schinken, Speck, Pilzen, Tomatensahnesauce, mit Käse überbacken", "12,50 €"),
  dish("regular-54", "54", "PENNE ALLA SARACENO", "(a, g, i, 2, 3)", "Makkaroni mit Broccoli, Knoblauch und Tomatensahnesauce überbacken", "12,50 €"),
  dish("regular-55", "55", "PENNE BANDIERA", "(a, c, g, h)", "Makkaroni mit Blattspinat, Knoblauch und Mozzarella in Tomatensauce", "13,50 €"),
  dish("regular-56", "56", "PENNE VALENTINO", "(a, c, g, h)", "Makkaroni mit Auberginen, Knoblauch, in Tomatensauce, Mozzarella und Parmesan überbacken", "13,00 €"),
  dish("regular-57", "57", "TAGLIATELLE FLAVIA", "(a, c, d, g, h)", "Bandnudeln in Schinkensahnesauce mit Speck", "11,50 €"),
  dish("regular-58", "58", "TAGLIATELLE MONTE ROSA", "(a, c, d, g, h, l)", "Bandnudeln mit Sauce Bolognese und Sahne", "11,50 €"),
  dish("regular-59", "59", "TAGLIATELLE BOSCAIOLA", "(a, c, d, g, h)", "Bandnudeln mit Champignons in Rahmsauce", "11,50 €"),
  dish("regular-60", "60", "TAGLIATELLE DELLA CASA", "(a, c, d, g, h)", "Bandnudeln mit Schinken und Speck, Pilzen und Erbsen in Tomatensahnesauce", "12,50 €"),
  dish("regular-61", "61", "TAGLIATELLE AL SALMONE", "(a, c, d, g, h)", "Bandnudeln in Lachssauce", "16,00 €"),
  dish("regular-62", "62", "TORTELLINI PANNA E PROSCIUTTO", "(a, b, c, d, e, g)", "Tortellini in Schinkensahnesauce mit Speck", "13,00 €"),
  dish("regular-63", "63", "TORTELLINI CON SPINACI E GORGONZOLA", "(a, b, c, d, e, g, i, 2, 3)", "Tortellini (mit Fleisch gefüllt) mit Spinat in Gorgonzola-Sahnesauce", "16,00 €"),
  dish("regular-64", "64", "CANNELONI AL FORNO", "(a, b, c, d, e, g, h)", "Vier mit Fleisch gefüllte Nudelrollen mit Tomaten und Béchamelsoße und Käse überbacken", "13,00 €"),
  dish("regular-65", "65", "LASAGNE AL FORNO", "(a, c, g, h, i, d, 2, 3)", "Hausgemachte Schichtnudeln mir Fleischsauce, Schinken und Käse überbacken", "13,00 €"),
];

const pizza = [
  dish("regular-70", "70", "PIZZA MARGHERITA", "(a, g, 2, 3)", "mit Tomatensauce und Käse", "9,50 €"),
  dish("regular-71", "71", "PIZZA NAPOLI", "(a, g, l)", "Tomatensauce, Käse, Knoblauch, Sardellen", "11,00 €"),
  dish("regular-72", "72", "PIZZA SALAMI", "(a, g, 2, 3)", "mit Tomatensauce, Käse und Salami", "11,00 €"),
  dish("regular-73", "73", "PIZZA PROSCIUTTO", "(a, f, g, 2, 3)", "Tomatensauce, Käse, Schinken", "11,00 €"),
  dish("regular-74", "74", "PIZZA FUNGHI", "(a,c,g, 2,3)", "mit Tomatensauce, Käse, Champignons", "11,00 €"),
  dish("regular-75", "75", "PIZZA TONNO", "(a, d, g, f, 2, 3)", "mit Tomatensauce, Käse, Thunfisch", "12,50 €"),
  dish("regular-76", "76", "PIZZA SICILIANA", "(a, g, l)", "mit Tomatensauce, Käse, Paprika, Sardellen und Kapern", "12,50 €"),
  dish("regular-77", "77", "PIZZA PUGLIESE", "(a, g)", "mit Tomatensauce, Käse, Zwiebeln und milden Peperoni (auf Wunsch auch scharfe Peperoni)", "12,50 €"),
  dish("regular-78", "78", "PIZZA HAWAII", "(a, g, 2, 3)", "Tomatensauce, Käse, Schinken, Ananas", "12,50 €"),
  dish("regular-79", "79", "PIZZA ROMANA", "(a, c, d, g)", "mit Tomatensauce, Käse, Schinken, Spargel und Ei", "12,50 €"),
  dish("regular-80", "80", "PIZZA QUATTRO STAGIONI", "(a, d, f, g, 2, 3)", "mit Tomatensauce, Käse, Champignons, Schinken, Artischocken und Thunfisch", "12,50 €"),
  dish("regular-81", "81", "PIZZA O SOLE MIO", "(a, d, g, c, 2, 3)", "mit Tomatensauce, Käse, Champignons, Schinken, Paprika und Ei", "13,50 €"),
  dish("regular-82", "82", "PIZZA VERDURA", "(a, g)", "mit Tomatensauce, Käse, Broccoli, Mais, Spargel und Knoblauch", "12,50 €"),
  dish("regular-83", "83", "PIZZA COLOSSEO", "(a, c, d, f, g)", "nach Art des Hauses", "14,50 €"),
  dish("regular-84", "84", "PIZZA CALZONE", "(a, g)", "gefüllte Pizza nach Art des Hauses", "14,50 €"),
  dish("regular-85", "85", "PIZZA CAPRICCIOSA", "(a, g, l, 3, 6)", "mit Tomatensauce, Käse, Artischocken, Schinken und Oliven", "13,50 €"),
  dish("regular-86", "86", "PIZZA BOLOGNESE", "(a, f, g, l)", "mit Käse, Sauce Bolognese, Schinken und Pilzen", "12,50 €"),
  dish("regular-87", "87", "PIZZA PESCATORE", "(a,b,d,g,n)", "Tomatensauce, Meeresfrüchte, Käse", "16,00 €"),
  dish("regular-88", "88", "PIZZA ERICA", "(a, b, d, g, n)", "mit Krabben", "16,00 €"),
];

const beef = [
  dish("regular-100", "100", "BISTECCA AI FERRI", "(g)", "Argentinisches Rumpsteak vom Grill", "31,00 €"),
  dish("regular-101", "101", "BISTECCA CIPOLLATA", "(g)", "Argentinisches Rumpsteak mit Zwiebeln", "32,00 €"),
  dish("regular-102", "102", "BISTECCA ALLE ERBE", "(g)", "Argentinisches Rumpsteak in Kräutersahnesauce", "32,00 €"),
  dish("regular-103", "103", "BISTECCA ALLA PIZZAIOLA", "(g, l)", "Argentinisches Rumpsteak mit Oregano, Oliven, Kapern und Tomatensauce", "32,00 €"),
  dish("regular-104", "104", "BISTECCA AI FUNGHI", "(a, g)", "Argentinisches Rumpsteak in Champignonrahmsauce", "32,00 €"),
  dish("regular-105", "105", "BISTECCA DI MANZO HAWAII", "(g)", "Argentinisches Rumpsteak mit Ananas, Käse und Tomatensahnesauce", "32,00 €"),
  dish("regular-106", "106", "BISTECCA DI MANZO AL PEPE VERDE", "(g)", "Argentinisches Rumpsteak in Pfeffersauce", "33,00 €"),
  dish("regular-107", "107", "BISTECCA DI MANZO AL GORGONZOLA", "(g)", "Argentinisches Rumpsteak in Gorgonzola-Sahnesauce", "33,00 €"),
  dish("regular-108", "108", "BISTECCA DI FILETTO DELLO CHEF", "(a, g)", "Argentinisches Rumpsteak (in Stücke geschnitten) mit Artischocken in Demiglace", "32,00 €"),
];

const fish = [
  dish("regular-110", "110", "CALAMARI FRITTI", "(a, c, d, n)", "Gebackene Tintenfischringe mit Remouladensauce", "19,50 €"),
  dish("regular-111", "111", "CALAMARI AL PEPE", "(g, n)", "Tintenfischringe in grüner Pfeffersauce", "20,50 €"),
  dish("regular-112", "112", "CALAMARI BISI", "(n)", "Tintenfischringe mit Knoblauch und Erbsen in Tomatensauce", "20,50 €"),
  dish("regular-113", "113", "GAMBERONI ALLA GRIGLIA", "(b)", "Scampi vom Grill", "31,00 €"),
  dish("regular-114", "114", "GAMBERONI ALL`AGLIO", "(b)", "Scampi mit Knoblauch, Basilikum, Oliven, pikant, Paprika", "27,00 €"),
  dish("regular-115", "115", "GAMBERONI AL PEPE", "(b, g)", "Scampi mit Knoblauch und grünem Pfeffer in Tomatensahnesauce", "27,00 €"),
  dish("regular-116", "116", "FILETTO DI SOGLIOLA IMPERIALE", "(d, g)", "Pangasiusfilet mit Kräutern in Sahnesauce", "22,50 €"),
  dish("regular-117", "117", "FILETTO DI SOGLIOLA COLOSSEO", "(d, g, l)", "Pangasiusfilet mit Kräuter und Kapern in Sahnesauce", "22,50 €"),
  dish("regular-118", "118", "PESCATRICE BIANCANEVE", "(d, g)", "Pangasiusfilet mit Knoblauch und Safran in pikanter Sahnesauce", "23,50 €"),
  dish("regular-119", "119", "SALMONE AL CARTOCCIO", "(b, g, d)", "Lachsfilet mit Krabben in provenzalischer Sauce", "28,50 €"),
  dish("regular-120", "120", "SALMONE ALL`ANDALUSA", "(d, g)", "Lachsfilet mit Paprika, Knoblauch und Tomatensahnesauce", "27,50 €"),
  dish("regular-121", "121", "SALMONE ALLA RUSTICA", "(d, g)", "Lachsfilet mit Champignons und Zwiebeln in Safransauce", "29,50 €"),
];

export const menuCategories: MenuCategory[] = [
  { id: "mittagstisch", filterLabel: "Mittagstisch", sections: [
    { id: "lunch-soups", heading: "SUPPEN", note: "In der Zeit von 12.00 - 14.00 Uhr kosten bei uns alle Suppen 4,90 €", dishes: lunchSoups },
    { id: "lunch-pasta", heading: "PASTA/ TEIGWAREN", note: "Mittagstisch von Dienstag bis Freitag und Sonntag", dishes: lunchPasta },
    { id: "lunch-pizza", heading: "PIZZEN", note: "Die meisten Nudel-/Pasta-/Teiggerichte und Pizzen kosten 9,00 €", dishes: lunchPizza },
  ] },
  { id: "antipasti", filterLabel: "Antipasti", sections: [
    { id: "antipasti-freddi", heading: "ANTIPASTI FREDDI", subheading: "KALTE VORSPEISEN", dishes: antipastiFreddi },
    { id: "antipasti-caldi", heading: "ANTIPASTI CALDI", subheading: "WARME VORSPEISEN", dishes: antipastiCaldi },
  ] },
  { id: "suppen", filterLabel: "Suppen", sections: [{ id: "soups", heading: "ZUPPE / SUPPEN", dishes: soups }] },
  { id: "salate", filterLabel: "Salate", sections: [{ id: "salads", heading: "INSALATE / SALATE", note: "Bitte wählen Sie: Italian Dressing (f, g, l, i), oder American Dressing (a, c, g, j)", dishes: salads }] },
  { id: "pasta", filterLabel: "Pasta", sections: [{ id: "pasta", heading: "PASTA / TEIGWAREN", dishes: pasta }] },
  { id: "pizza", filterLabel: "Pizza", sections: [{ id: "pizza", heading: "PIZZA / PIZZA", dishes: pizza }] },
  { id: "rindfleisch", filterLabel: "Rindfleisch", sections: [{ id: "beef", heading: "MANZO / RINDFLEISCH", note: "Alle Fleischgerichte servieren wir mit unserer Tagesbeilage!", dishes: beef }] },
  { id: "fisch", filterLabel: "Fisch", sections: [{ id: "fish", heading: "PESCE / FISCH", note: "Zu allen Gerichten servieren wir einen kleinen gemischten Salat!", dishes: fish }] },
];

export const allergenLegend = [
  "( a ) Glutenhaltiges Getreide", "( b ) Krebstiere und daraus gewonnene Erzeugnisse", "( c ) Eier und daraus gewonnene Erzeugnisse", "( d ) Fische und daraus gewonnene Erzeugnisse", "( e ) Erdnüsse und daraus gewonnene Erzeugnisse", "( f ) Sojabohnen und daraus gewonnene Erzeugnisse", "( g ) Milch und daraus gewonnene Erzeugnisse (einschl. Laktose)", "( h ) Schalenfrüchte", "( i ) Sellerie und daraus gewonnene Erzeugnisse", "( j ) Senf und daraus gewonnene Erzeugnisse", "( k ) Sesamsamen und daraus gewonnene Erzeugnisse", "( l ) Schwefeldioxid und Sulphite", "( m ) Lupinen und daraus gewonnene Erzeugnisse", "( n ) Weichtiere und daraus gewonnene Erzeugnisse", "( 1 ) mit Farbstoff", "( 2 ) mit Konservierungsstoff", "( 3 ) mit Antioxydationsmittel", "( 4 ) mit Geschmacksverstärker", "( 5 ) geschwefelt", "( 6 ) geschwärzt", "( 7 ) mit Phosphat", "( 8 ) mit Milcheiweiß", "( 9 ) koffeinhaltig", "( 10 ) chininhaltig", "( 11 ) mit Süßungsmittel(n)", "( 12 ) enthält eine Phenylalaninquelle", "( 13 ) gewachst",
];

export const menuSource = { checkedAt: "12.10.2026", url: "https://ristorante-colosseo.eatbu.com/?lang=de" };
