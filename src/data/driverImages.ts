// Driver & Team imagery sourced from Stitch-generated designs
// Images hosted on Google CDN (lh3.googleusercontent.com/aida-public/)

/**
 * Maps driverId → car/team image URL.
 * These are team car or F1-related action shots used in driver cards.
 */
export const DRIVER_IMAGES: Record<string, string> = {
  verstappen:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0KsTko5gyNBhn9Qt5uQe9HQUMn8Sqhb8Lz4Ob4806wOU1VU_K4VUt0LNCl76Tpi3zB59SWEZIuwq9vOgdZNr6YunRqS9zhMKWtpvQIlAaz68Qmf_LeXCUpbi86cLigmUM1rtH_6rPu6UGR7Y3iiKkZOdIVpFVW8w7hupWgUSTAlTtsHC4iXiAG61YI4TcYhZp5a0uo_6GBQQ23Xk-Db_CTy4T6TvKLmtaa6k8vEyf_tdUjsSWOEgitD-cDmct1-tlcpmolLA2mAg',
  max_verstappen:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0KsTko5gyNBhn9Qt5uQe9HQUMn8Sqhb8Lz4Ob4806wOU1VU_K4VUt0LNCl76Tpi3zB59SWEZIuwq9vOgdZNr6YunRqS9zhMKWtpvQIlAaz68Qmf_LeXCUpbi86cLigmUM1rtH_6rPu6UGR7Y3iiKkZOdIVpFVW8w7hupWgUSTAlTtsHC4iXiAG61YI4TcYhZp5a0uo_6GBQQ23Xk-Db_CTy4T6TvKLmtaa6k8vEyf_tdUjsSWOEgitD-cDmct1-tlcpmolLA2mAg',
  hamilton:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHkXRhq32YAJkVSHD-zgCDnXJnYIg-3yzUaItynqYIIWk0HI1kFqdNwwUC_HN7KnNbPLXRBrY9jjOw9HucNsghHH43z2P8w_6q2ix5Z1ePK07UZXRJ-YFIk60DG_Go4-QQ0omKzbVAiGK03kQHYalNgGRZHpk72BWHxOUzqZeWWGGU-ysdZJWeUJcGLVc3B8LzbGgcN5OGeaUrvzA013c6Cx8TF8ML6OhIx_mJg8DridFKGfjS-CQrV7hgDVnxO1ozqbvf4SGK9s0',
  norris:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7q70jaOyn-xlzZTJT1AJvaxVbkCdFZevj7cuZ3SJtCQZiMxwWOAqkPe4qmTot6qUFtY-Llt_Qz0-N8RwnZVg0h6WI72EX32IMEyHPMne30qY7hDTKRbS2IfNBvqOwShMHhP-IQYmZmV30XYQ74T7le7RkwRpTEB4Q6PtbTNUkzBIK13CmQb6qFFIiCw01AksXRildz8p5rJ55GNRpUNtPiZPfdtzq7C7xMEhH10GB3fIy9XgXbbQ_F3JVAK1P20PH6_ll8d2SoZw',
  leclerc:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHY1EGNj4t5SvG7GDV5ZQNGWqfTmZD5HdLmi7QRUE07U7T36PQLMV2OOtNLq_KsR5Ao-TwrHUQd400XSwgtR_V7DUX6c1t-KLKBwBDJhLt3V4SrmCK6ArRkniLf8Ff-PcD2c55Uc3VVFD-6zD65-8_LU-3bVDZKW7HYwC34-qq1xNr6iwc5-lwalZV60KE3os2hZQwoLGVY1O21zRkL-7fH5_V1UwQ07HgMwk1e7nHr1mytudJEUhiNlzQCkh-Sba9mGRsv0VmNu0',
  russell:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCHfVrFN1reZBrvLJuMBADYJArycNMayIo7KBWecgq3SogkXKGz0hBDQuqtXmORWYGbHWtlbFt2-YqFUi-fOnyO0JbnSyrR1FXPCK8oQXw6DlAQ4fC1nOh3j8bKwH1pF_1VvEqAFRYvCwSz8WYRJ4puFevjwCGfgmc5K6tITj2Pi6zUL5UlZWLpFPpe7XKtnaFY2Bcl23EHx7wSLy78VpX47irDimPCguSxMg5u5rfJchd8mwr82DjcI9SkRwyCRTnVnBnzygkMXU',
  antonelli:
    'https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
  albon:
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Alex_Albon_%28cropped%29.jpg',
  bearman: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg',
  gasly: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/2022_French_Grand_Prix_%2852279065728%29_%28midcrop%29.png',
  lawson: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7793%29.jpg',
  arvid_lindblad: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg',
  hadjar: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg',
  piastri: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg',
  sainz: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Formula1Gabelhofen2022_%2804%29_%28cropped2%29.jpg',
  bortoleto: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Gabriel_Bortoleto_%28cropped%29.jpg',
  colapinto: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8704%29_%28cropped%29.jpg',
  ocon: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg',
  hulkenberg: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Nico_Hulkenberg_2016_Malaysia.jpg',
  bottas: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7567%29.jpg',
  perez: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2021_US_GP_driver_parade_%28cropped2%29.jpg',
  alonso: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Alonso-68_%2824710447098%29.jpg',
  stroll: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg'
};

/**
 * Fallback telemetry/racing image used when no driver-specific image is available.
 */
export const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRunCehCak270rBnRC2zZsxiBFeJIeuJe29S9PzkS4LotcGnoZZQ_RiXsz77SGt4BM10Hbdgv1VEsp-WRby2XEOmrPuReupnwLwa4wEmpb5hYwpN1ClDrlvwM73ND1adbu6meUSz1CCNX_Zmj-7CpjMgAzBOvWPB4JYf3hmwJDgzPKwzsqcDRyI6Hilvj0-Lm7e4B_H2m1JYJKgBSO5upHcPVyXzn2bLMb6371g30X1HMJb1ECNF_WExij34aKTUPdf4J5vzpOjyY';

/**
 * Hero car image for the Dashboard page.
 */
export const HERO_CAR_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0KsTko5gyNBhn9Qt5uQe9HQUMn8Sqhb8Lz4Ob4806wOU1VU_K4VUt0LNCl76Tpi3zB59SWEZIuwq9vOgdZNr6YunRqS9zhMKWtpvQIlAaz68Qmf_LeXCUpbi86cLigmUM1rtH_6rPu6UGR7Y3iiKkZOdIVpFVW8w7hupWgUSTAlTtsHC4iXiAG61YI4TcYhZp5a0uo_6GBQQ23Xk-Db_CTy4T6TvKLmtaa6k8vEyf_tdUjsSWOEgitD-cDmct1-tlcpmolLA2mAg';

/**
 * Returns the image URL for a given driverId, or the fallback image.
 */
export function getDriverImage(driverId: string): string {
  return DRIVER_IMAGES[driverId] || FALLBACK_IMAGE;
}

/**
 * Maps driverId → portrait image URL.
 * Extracted from the Dashboard design for the Top 5 driver standings.
 */
export const DRIVER_PORTRAITS: Record<string, string> = {
  "russell": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg/960px-KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg",
  "antonelli": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg",
  "leclerc": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro_%28cropped2%29.jpg/960px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro_%28cropped2%29.jpg",
  "hamilton": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/960px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg",
  "bearman": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg/960px-2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg",
  "norris": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg/960px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg",
  "gasly": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2022_French_Grand_Prix_%2852279065728%29_%28midcrop%29.png/960px-2022_French_Grand_Prix_%2852279065728%29_%28midcrop%29.png",
  "max_verstappen": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg/960px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg",
  "lawson": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7793%29.jpg/960px-Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7793%29.jpg",
  "arvid_lindblad": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg/960px-Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg",
  "hadjar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg/960px-Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg",
  "piastri": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg/960px-2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg",
  "sainz": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Formula1Gabelhofen2022_%2804%29_%28cropped2%29.jpg/960px-Formula1Gabelhofen2022_%2804%29_%28cropped2%29.jpg",
  "bortoleto": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Gabriel_Bortoleto_%28cropped%29.jpg",
  "colapinto": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8704%29_%28cropped%29.jpg/960px-Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8704%29_%28cropped%29.jpg",
  "ocon": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg/960px-Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg",
  "hulkenberg": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Nico_Hulkenberg_2016_Malaysia.jpg",
  "bottas": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7567%29.jpg/960px-Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7567%29.jpg",
  "perez": "https://upload.wikimedia.org/wikipedia/commons/5/55/2021_US_GP_driver_parade_%28cropped2%29.jpg",
  "alonso": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Alonso-68_%2824710447098%29.jpg/960px-Alonso-68_%2824710447098%29.jpg",
  "stroll": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg/960px-2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg",
  "albon": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Alex_Albon_%28cropped%29.jpg"
};

/**
 * Returns the portrait image URL for a given driverId, or the global fallback image
 */
export function getDriverPortrait(driverId: string): string {
  return DRIVER_PORTRAITS[driverId] || FALLBACK_IMAGE;
}


