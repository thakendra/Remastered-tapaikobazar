/**
 * Seeding script to push all 40+ vehicles and hero slides into Sanity Studio
 * 
 * Usage:
 *   $env:SANITY_AUTH_TOKEN="your_write_token"
 *   node seedSanity.js
 * 
 * Or pass token directly:
 *   node seedSanity.js <YOUR_SANITY_WRITE_TOKEN>
 */

import { createClient } from '@sanity/client';

const token = process.argv[2] || process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.log(`
========================================================================
SANITY SEED SCRIPT
========================================================================
To populate Sanity with all 40+ vehicles from TapaikoBazar, you need a Sanity API Write Token.

1. Go to https://www.sanity.io/manage/project/m8sr7eub/api
2. Under 'API Tokens', click '+ Add API token'
3. Give it a name (e.g. 'Seed Token') and select 'Editor' permissions
4. Copy the token and run:
   node seedSanity.js <PASTE_YOUR_TOKEN_HERE>
========================================================================
`);
  process.exit(0);
}

const client = createClient({
  projectId: 'm8sr7eub',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token,
});

const IMG = {
  kyc: 'https://cg-ev.com/storage/block/2023/05/website-img6-min-1_1684476974.png',
  danfe: 'https://motors.theego.com.np/wp-content/uploads/2023/05/dfsk-danfe-gallery-9.png',
  danfe2: 'https://motors.theego.com.np/wp-content/uploads/2023/05/dfsk-danfe-gallery-2.png',
  srm: 'https://www.gneenev.com/d/files/xhszy1.jpg',
  dong: 'https://trivenimotocorp.com.np/public/images/2015174667.jpg',
  dong14: 'https://trivenimotocorp.com.np/public/images/1272401361489950890_122186397518255162_2520902099410590018_n.jpg',
  dfacEm26: '/assets/dfac-em26.jpg',
  dfacEv32: '/assets/dfac-ev32.jpg',
  kawai: 'https://hams.com.np/upload_file/blog/1772530764_1385603448_hams%20ev%20van%20(87%20of%20151).JPG',
  higer: 'https://en.higer.com/uploadfiles/2024/11/20241120102842890.jpg?MjAyNDExMjAxMDI4NDI4OTAuanBn',
  joylong: 'https://vgnepalev.com/wp-content/uploads/2024/11/Untitled-design-2024-11-29T143713.056.png',
  king14: 'https://www.cgdigital.com.np/api/images/products/HzQiaO_1733388745-KINGLONG01.jpg',
  king15: 'https://cg-ev.com/storage/banner/2023/10/k1_1696571921.jpg',
  king16: 'https://cg-ev.com/storage/banner/2023/10/k2_1696571968.jpg',
  king19: 'https://www.cgdigital.com.np/api/images/products/H9lVzj_1733392649-KINGLONG01.jpg',
  g6: 'https://xpeng.cgmotors.com.np/gac/g6images/G6/G6banner-new.jpg',
  aionv: 'https://www.gneenev.com/d/files/1(10).jpg',
  aiony: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/2021_GAC_Aion_Y_%28front%29.jpg',
  rid2: '/assets/riddara-2wd.webp',
  rid4: '/assets/riddara-tapaikobazar.png',
  hvh: 'https://carpricesnepal.com/assets/img/product/product-6687861a6c457Henry-Volts-Model-H.webp',
  hvc: 'https://techlekh.com/wp-content/uploads/2024/09/Henrey-Volts-HEV300.png',
  naami: 'https://dongfengnepal.com/wp-content/uploads/2024/08/New-Project1.png',
  deepal: 'https://www.changaneurope.com/Portals/2/adam/ContentBlocks/CfRkY2zSmkygQRDwi6bUTw/Image/S05_Full_01.png?w=1920&h=960&quality=75&mode=crop&scale=both&format=webp',
  seres: 'https://cdn.motor1.com/images/mgl/JljwJ/s3/huawei-seres-sf5-lead-image.webp',
  winger: 'https://sarathiecooter.com.np/wp-content/uploads/2025/05/winger-300x300.jpg',
  e3g: 'https://sarathiecooter.com.np/wp-content/uploads/2025/07/Ecooter-E3-Gray.png',
  e3l: 'https://sarathiecooter.com.np/wp-content/uploads/2025/05/graywithgreen-300x300.jpg',
  mnk3: 'https://sarathiecooter.com.np/wp-content/uploads/2025/05/blue-300x300.jpg',
  s90: 'https://sarathiecooter.com.np/wp-content/uploads/2025/05/Luyuan-S90-Photo-1-300x300.webp',
  garow: 'https://garowgroup.com/Upload/%E4%BA%A7%E5%93%81/%E5%B3%B0%E4%BA%91/%E5%B7%A645-8efdcb9f88b045639b03999e44887d60.jpg',
  shine: 'https://honda.com.np/wp-content/uploads/product-catalog/motorcycles/DSC_9511-copy-3_1_11zon-scaled.jpg',
  dio: 'https://honda.com.np/wp-content/uploads/product-catalog/motorcycles/Sport-Red-min.png',
  apache: '/assets/tvs-apache.webp',
  ntorq: 'https://tvsnepal.com/images/color/Ntorq-Race-Edition60c1e8be895bbNtorq-Race-Edition5e1b0fdfd160aNtorq-Race-Edition.png',
  fzs: 'https://www.maw2wheelers.com/wp-content/uploads/2024/09/FZ-FI-V3-Black.jpg',
  rayzr: 'https://www.maw2wheelers.com/wp-content/uploads/2024/09/1.-RayZR-HYBRID-Disc-Premium-Premium-Plus.jpg',
  ns200: '/assets/ns-200-nepal.webp',
  hondaSp125: 'https://honda.com.np/wp-content/uploads/product-catalog/motorcycles/SP-125-Web-Banner.png',
  hondaDio110: 'https://honda.com.np/wp-content/uploads/product-catalog/motorcycles/Dio-110-BS6-Web-Banner.png',
  hondaShine: 'https://honda.com.np/wp-content/uploads/product-catalog/motorcycles/Honda-Shine-BS6-Web-Banner.png'
};

function vanTerms(down) {
  return [
    { label: 'Drivetrain', value: 'Electric' },
    { label: 'Downpayment', value: 'NPR ' + down },
    { label: 'EMI tenure', value: 'Up to 5 years' },
    { label: 'Interest rate', value: '5% – 9%' },
    { label: 'Warranty', value: 'As per company policy' },
    { label: 'Booking amount', value: 'NPR 50,000' }
  ];
}

const VEHICLES = [
  // Vans
  {
    id: 'kyc11', type: 'van', brand: 'KYC', name: 'KYC 11 seater', price: 4199000, down: 450000,
    seatsMin: 11, seatsMax: 11, ac: false, img: IMG.kyc,
    blurb: 'The cheapest way into an electric van in Nepal. Eleven seats, no air conditioning, and the lowest downpayment on our floor.',
    specs: [{ label: 'Seating', value: '11 persons' }, { label: 'Air conditioning', value: 'No' }].concat(vanTerms('4,50,000')),
    highlights: ['Lowest downpayment of any van we stock, at NPR 4,50,000.', 'No collateral needed when you put down 20 to 40 percent.', 'Five year EMI at 5 to 9 percent through our partner banks.']
  },
  {
    id: 'srm11', type: 'van', brand: 'SRM', name: 'SRM 11 seater', price: 4550000, down: 500000,
    seatsMin: 11, seatsMax: 11, ac: true, img: IMG.srm,
    blurb: 'Eleven air conditioned seats a little under the Dongfeng, and one of the newer names on the floor.',
    specs: [{ label: 'Seating', value: '11 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Air conditioned throughout at close to the entry price.', 'Company warranty included.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'danfe11', type: 'van', brand: 'Danfe', name: 'Danfe 11 seater', price: 4595000, down: 500000,
    seatsMin: 11, seatsMax: 11, ac: true, img: IMG.danfe,
    blurb: 'Eleven seats with full air conditioning, which is what most school and office routes end up needing.',
    specs: [{ label: 'Seating', value: '11 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Air conditioned throughout, unlike the KYC at a similar size.', 'Company warranty included.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'kawai', type: 'van', brand: 'Kawai', name: 'Kawai 14–16 seater', price: 4650000,
    priceLabel: 'NPR 46,50,000 – 63,50,000', down: 500000,
    seatsMin: 14, seatsMax: 16, ac: true, img: IMG.kawai,
    blurb: 'Sold in fourteen and sixteen seat layouts, so the price moves with the trim you pick. Ask at the counter which is on the floor today.',
    specs: [{ label: 'Seating', value: '14 to 16 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Two layouts, fourteen or sixteen seats.', 'Air conditioned, company warranty.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'dong11', type: 'van', brand: 'Dongfeng', name: 'Dongfeng 11 seater', price: 4950000, down: 500000,
    seatsMin: 11, seatsMax: 11, ac: true, img: IMG.dong,
    blurb: 'A heavier build than the entry vans, with air conditioning and the finish that comes with it.',
    specs: [{ label: 'Seating', value: '11 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Premium build compared with the entry level vans.', 'Air conditioned, company warranty.', 'Also available as a fourteen seater.']
  },
  {
    id: 'dfacEm26', type: 'van', brand: 'DFAC', name: 'DFAC EM26 11 seater', price: 4950000, down: 500000,
    seatsMin: 11, seatsMax: 11, ac: true, img: IMG.dfacEm26,
    blurb: 'The eleven seat DFAC, photographed on our own floor. Same price as the Dongfeng with a different cabin.',
    specs: [{ label: 'Seating', value: '11 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Eleven seats with full air conditioning.', 'Company warranty included.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'joylong', type: 'van', brand: 'Joylong', name: 'Joylong 11–19 seater', price: 5600000,
    priceLabel: 'NPR 56,00,000 – 74,00,000', down: 500000,
    seatsMin: 11, seatsMax: 19, ac: true, img: IMG.joylong,
    blurb: 'The widest range of layouts we carry, from eleven seats up to nineteen. Price depends on the size you settle on.',
    specs: [{ label: 'Seating', value: '11 to 19 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Anything from eleven to nineteen seats.', 'Air conditioned, company warranty.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'higer', type: 'van', brand: 'Higer', name: 'Higer 16–19 seater', price: 5990000, down: 500000,
    seatsMin: 16, seatsMax: 19, ac: true, img: IMG.higer,
    blurb: 'A large capacity van at a price closer to the fourteen seaters. Good value if you are filling every seat.',
    specs: [{ label: 'Seating', value: '16 to 19 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Sixteen to nineteen seats for the price of a smaller van.', 'Air conditioned, company warranty.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'king14', type: 'van', brand: 'Kinglong', name: 'Kinglong 14 seater', price: 6050000, down: 500000,
    seatsMin: 14, seatsMax: 14, ac: true, img: IMG.king14,
    blurb: 'The fourteen seat Kinglong, with a roomier cabin layout than the fifteen.',
    specs: [{ label: 'Seating', value: '14 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Roomier layout than the fifteen seater.', 'Air conditioned, company warranty.', 'Five year EMI available.']
  },
  {
    id: 'dong14', type: 'van', brand: 'Dongfeng', name: 'Dongfeng 14 seater', price: 6100000, down: 500000,
    seatsMin: 14, seatsMax: 14, ac: true, img: IMG.dong14,
    blurb: 'Three more seats than the eleven seater on the same platform. Popular with tour operators.',
    specs: [{ label: 'Seating', value: '14 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Fourteen seats for tour and staff routes.', 'Air conditioned, company warranty.', 'Same downpayment as the eleven seater.']
  },
  {
    id: 'dfacEv32', type: 'van', brand: 'DFAC', name: 'DFAC EV32 14 seater', price: 6100000, down: 500000,
    seatsMin: 14, seatsMax: 14, ac: true, img: IMG.dfacEv32,
    blurb: 'The fourteen seat DFAC, also photographed at Panipokhari. Priced level with the Dongfeng fourteen.',
    specs: [{ label: 'Seating', value: '14 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Fourteen seats with full air conditioning.', 'Company warranty included.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'king15', type: 'van', brand: 'Kinglong', name: 'Kinglong 15 seater', price: 6200000, down: 500000,
    seatsMin: 15, seatsMax: 15, ac: true, img: IMG.king15,
    blurb: 'Fifteen seats for a little over the fourteen. The best value per seat in the Kinglong range.',
    specs: [{ label: 'Seating', value: '15 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['One more seat than the fourteen for NPR 1,50,000.', 'Air conditioned throughout.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'king16', type: 'van', brand: 'Kinglong', name: 'Kinglong 16 seater', price: 7800000, down: 500000,
    seatsMin: 16, seatsMax: 16, ac: true, img: IMG.king16,
    blurb: 'A sixteen seat Kinglong with the fittings to match the price. The one most tour operators come in asking for.',
    specs: [{ label: 'Seating', value: '16 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Sixteen seats with the full Kinglong fit out.', 'Air conditioned throughout, company warranty.', 'Five year EMI from NPR 5,00,000 down.']
  },
  {
    id: 'king19', type: 'van', brand: 'Kinglong', name: 'Kinglong 19 seater', price: 8100000, down: 500000,
    seatsMin: 19, seatsMax: 19, ac: true, img: IMG.king19,
    blurb: 'The largest electric van on our floor. Nineteen seats, and still five year financing.',
    specs: [{ label: 'Seating', value: '19 persons' }, { label: 'Air conditioning', value: 'Yes' }].concat(vanTerms('5,00,000')),
    highlights: ['Nineteen seats, the most of anything electric here.', 'Air conditioned throughout, company warranty.', 'Downpayment still NPR 5,00,000.']
  },

  // Cars
  {
    id: 'g6', type: 'car', brand: 'Xpeng', name: 'Xpeng G6', price: 8499000, down: 0, img: IMG.g6,
    blurb: 'A coupe SUV with a five star Euro NCAP rating and 435 kilometres of range. The most car you can buy from us.',
    specs: [{ label: 'Motor', value: '190 kW' }, { label: 'Range', value: '435 km' }, { label: 'Body', value: 'Coupe SUV, rear wheel drive' }, { label: '0 to 100', value: '6.9 seconds' }, { label: 'Safety', value: '5 star Euro NCAP' }, { label: 'Distributor', value: 'CG Motors Nepal' }],
    highlights: ['Four hundred thirty five kilometres on a charge.', 'Eight year battery warranty.', 'Easy EMI through our partner banks.']
  },
  {
    id: 'aionv', type: 'car', brand: 'GAC Aion', name: 'GAC Aion V', price: null, down: 0, img: IMG.aionv,
    blurb: 'A long range premium SUV with Level 2 plus driver assistance. Priced at the counter.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Range', value: '500+ km' }, { label: 'Body', value: 'SUV' }, { label: 'Seats', value: '5' }, { label: 'Assistance', value: 'Level 2+ ADAS' }],
    highlights: ['Over five hundred kilometres of range.', 'Level 2 plus driver assistance.', 'Easy EMI available.']
  },
  {
    id: 'aiony', type: 'car', brand: 'GAC Aion', name: 'GAC Aion Y', price: null, down: 0, img: IMG.aiony,
    blurb: 'The compact Aion. Best value for money in the GAC range and the one that moves fastest off our floor.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Range', value: '430 km' }, { label: 'Body', value: 'Crossover' }, { label: 'Seats', value: '5' }],
    highlights: ['Four hundred thirty kilometres of range.', 'Best value in the GAC range.', 'Easy EMI available.']
  },
  {
    id: 'rid2', type: 'car', brand: 'Ridaara', name: 'Ridaara 2WD', price: null, down: 0, img: IMG.rid2,
    blurb: 'A rear wheel drive electric SUV with long range, and the cheaper of the two Ridaara trims.',
    specs: [{ label: 'Drivetrain', value: 'Electric, rear wheel drive' }, { label: 'Range', value: 'Long range' }, { label: 'Body', value: 'SUV' }, { label: 'Seats', value: '5' }],
    highlights: ['Rear wheel drive, long range.', 'Cheaper of the two Ridaara trims.', 'Easy EMI available.']
  },
  {
    id: 'rid4', type: 'car', brand: 'Ridaara', name: 'Ridaara 4WD', price: null, down: 0, img: IMG.rid4,
    blurb: 'The all wheel drive Ridaara, for people who leave the valley often.',
    specs: [{ label: 'Drivetrain', value: 'Electric, 4WD / AWD' }, { label: 'Range', value: 'Long range' }, { label: 'Body', value: 'SUV' }, { label: 'Seats', value: '5' }],
    highlights: ['All wheel drive for rough roads.', 'Performance trim of the Ridaara.', 'Easy EMI available.']
  },
  {
    id: 'hvh', type: 'car', brand: 'Dayun Henry Volts', name: 'Henry Volts Model H', price: null, down: 0, img: IMG.hvh,
    blurb: 'An electric sedan with a spacious cabin. The family car of the Henry Volts range.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Range', value: 'Long range' }, { label: 'Body', value: 'Sedan' }, { label: 'Seats', value: '5' }],
    highlights: ['Spacious sedan interior.', 'Smart drive features.', 'Easy EMI available.']
  },
  {
    id: 'hvc', type: 'car', brand: 'Dayun Henry Volts', name: 'Henry Volts Model C', price: null, down: 0, img: IMG.hvc,
    blurb: 'A compact hatchback built for city running. Efficient and easy to park.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Range', value: 'Urban range' }, { label: 'Body', value: 'Hatchback' }, { label: 'Seats', value: '5' }],
    highlights: ['Compact enough for city traffic.', 'Efficient urban range.', 'Easy EMI available.']
  },
  {
    id: 'naami', type: 'car', brand: 'Naami', name: 'Naami Box E3', price: null, down: 0, img: IMG.naami,
    blurb: 'A mini four seater, and the most affordable way into an electric car here.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Range', value: 'City range' }, { label: 'Body', value: 'Mini car' }, { label: 'Seats', value: '4' }],
    highlights: ['Most affordable electric car we stock.', 'Four seats, city range.', 'Easy EMI available.']
  },
  {
    id: 'deepal', type: 'car', brand: 'Deepal (Changan)', name: 'Deepal', price: null, down: 0, img: IMG.deepal,
    status: 'Pre-booking open',
    blurb: 'Changan’s luxury electric line with Huawei technology inside. Not landed yet — pre-booking is open.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Segment', value: 'Premium' }, { label: 'Body', value: 'Sedan and SUV' }, { label: 'Seats', value: '5' }, { label: 'Status', value: 'Pre-booking open' }],
    highlights: ['Pre-booking is open now.', 'Huawei technology inside.', 'Register your interest at the counter.']
  },
  {
    id: 'seres', type: 'car', brand: 'Seres (Huawei)', name: 'Seres', price: null, down: 0, img: IMG.seres,
    status: 'Coming soon',
    blurb: 'Huawei’s intelligent electric SUV, in five and seven seat layouts. Arriving soon.',
    specs: [{ label: 'Drivetrain', value: 'Electric' }, { label: 'Software', value: 'Huawei smart drive' }, { label: 'Body', value: 'SUV' }, { label: 'Seats', value: '5 to 7' }, { label: 'Status', value: 'Coming soon' }],
    highlights: ['Huawei smart drive software.', 'Five to seven seats.', 'Register your interest at the counter.']
  },

  // Scooters
  {
    id: 'mnk3', type: 'scooter', brand: 'Luyuan', name: 'Luyuan MNK3', price: 192600,
    priceLabel: 'NPR 1,92,600 – 2,37,600', down: 0, img: IMG.mnk3,
    blurb: 'The cheapest electric scooter on our floor, with NFC security and an oil cooled hub motor.',
    specs: [{ label: 'Rated motor', value: '1500W oil cooled hub' }, { label: 'Peak power', value: '2800 W' }, { label: 'Battery', value: '72V 38AH graphene gel' }, { label: 'Charging time', value: '5 – 6 hours' }, { label: 'Range', value: 'Up to 120 km' }, { label: 'Speed', value: '60 – 65 km/h' }, { label: 'Brakes', value: 'Front and rear disc' }, { label: 'Security', value: 'NFC, anti theft, wheel lock' }, { label: 'Display', value: 'LCD with LED DRL' }, { label: 'Extras', value: 'USB charging, 180mm clearance' }],
    highlights: ['Lowest priced electric scooter we sell.', 'NFC security and LED daytime running lights.', 'Up to one hundred twenty kilometres of range.']
  },
  {
    id: 'winger', type: 'scooter', brand: 'Sarathi', name: 'Sarathi Winger', price: 209700,
    priceLabel: 'NPR 2,09,700 – 2,54,700', down: 0, img: IMG.winger,
    blurb: 'A city commuter from the Sarathi ZER Electric range, sold in a few trims.',
    specs: [{ label: 'Type', value: 'Electric scooter' }, { label: 'Battery', value: 'Gel battery' }, { label: 'Brand', value: 'ZER Electric / Sarathi' }, { label: 'Brakes', value: 'Disc brakes' }, { label: 'Range', value: 'Long range' }, { label: 'Charging', value: '5 – 6 hours' }, { label: 'Security', value: 'Anti theft alarm' }, { label: 'Features', value: 'Digital display, LED lights' }],
    highlights: ['Stylish urban commuter with easy EMI.', 'Gel battery pack.', 'Several trims to choose from at the showroom.']
  },
  {
    id: 's90', type: 'scooter', brand: 'Luyuan', name: 'Luyuan S90', price: 215000,
    priceLabel: 'NPR 2,15,000 – 2,60,000', down: 0, img: IMG.s90,
    blurb: 'A 3000W oil cooled motor, three riding modes and a reverse gear. IP67 rated.',
    specs: [{ label: 'Rated motor', value: '1500W oil cooled' }, { label: 'Peak power', value: '3000 W' }, { label: 'Battery', value: '72V 38AH graphene gel' }, { label: 'Range', value: 'Up to 120 km' }, { label: 'Speed modes', value: 'Eco, Comfort, Sport' }, { label: 'Top speed', value: '65 km/h' }, { label: 'Brakes', value: 'Front and rear disc' }, { label: 'Security', value: 'NFC, anti theft, wheel lock, reverse gear' }, { label: 'Display', value: 'Dual display, projector DRL' }, { label: 'Water resistance', value: 'IP67' }],
    highlights: ['Three speed modes and a reverse gear.', 'IP67 rated against water and dust.', 'NFC security.']
  },
  {
    id: 'e3g', type: 'scooter', brand: 'Ecooter', name: 'Ecooter E3 Graphene', price: 225000, down: 0, img: IMG.e3g,
    blurb: 'The graphene battery version of the E3. Cruise control and keyless entry as standard.',
    specs: [{ label: 'Rated motor', value: '1500 W' }, { label: 'Peak power', value: '3000 W' }, { label: 'Battery', value: '72V 38AH graphene gel' }, { label: 'Charging time', value: '5 – 6 hours' }, { label: 'Range', value: '100 – 120 km' }, { label: 'Top speed', value: '65 km/h' }, { label: 'Max torque', value: '170 N.m' }, { label: 'Brakes', value: 'Front and rear disc' }, { label: 'Security', value: 'Anti theft and wheel lock' }, { label: 'Features', value: 'Cruise control, keyless, USB, parking sensor' }],
    highlights: ['One hundred to one hundred twenty kilometres on a charge.', 'Cruise control and keyless entry.', 'Cheaper than the lithium version.']
  },
  {
    id: 'e3l', type: 'scooter', brand: 'Ecooter', name: 'Ecooter E3 Lithium', price: 270000, down: 0, img: IMG.e3l,
    blurb: 'Same scooter, lithium pack. Lighter, longer lasting, and priced accordingly.',
    specs: [{ label: 'Rated motor', value: '1500 W' }, { label: 'Peak power', value: '3000 W' }, { label: 'Battery', value: 'Lithium' }, { label: 'Charging time', value: '5 – 6 hours' }, { label: 'Range', value: '100 – 120 km' }, { label: 'Top speed', value: '65 km/h' }, { label: 'Max torque', value: '170 N.m' }, { label: 'Brakes', value: 'Front and rear disc' }, { label: 'Security', value: 'Anti theft and wheel lock' }, { label: 'Features', value: 'Cruise control, keyless, USB, parking sensor' }],
    highlights: ['Higher range and longer battery life.', 'Keyless entry and USB charging.', 'Same 1500W motor as the graphene version.']
  },
  {
    id: 'garow', type: 'scooter', brand: 'Garow', name: 'Garow FY100', price: null, down: 0, img: IMG.garow,
    status: 'New arrival',
    blurb: 'The newest scooter on the floor. Priced at the counter while the first batch settles in.',
    specs: [{ label: 'Model', value: 'FY100' }, { label: 'Type', value: 'Electric scooter' }, { label: 'Drive', value: 'Hub motor' }, { label: 'Brakes', value: 'Front disc' }, { label: 'Design', value: 'Urban commuter' }, { label: 'Features', value: 'LED headlamp, digital dash' }, { label: 'Status', value: 'New arrival' }],
    highlights: ['Newest electric scooter we stock.', 'LED headlamp and digital dash.', 'Ask at the counter for the current price.']
  },

  // Bikes
  {
    id: 'ntorq', type: 'bike', brand: 'TVS', name: 'TVS Ntorq 125 Race Edition', price: 279900, down: 0, img: IMG.ntorq,
    blurb: 'The scooter with a Bluetooth console. Race Edition trim, and a favourite with younger riders.',
    specs: [{ label: 'Engine', value: '124.8cc' }, { label: 'Mileage', value: '47 kmpl' }, { label: 'Power', value: '9.38 PS' }, { label: 'Console', value: 'Bluetooth connected' }, { label: 'Trim', value: 'Race Edition' }],
    highlights: ['Bluetooth connected console.', 'Forty seven kilometres to the litre.', 'Easy EMI financing available.']
  },
  {
    id: 'shine', type: 'bike', brand: 'Honda', name: 'Honda Shine 125 BS6', price: 292900, down: 0, img: IMG.shine,
    blurb: 'The commuter most people in Kathmandu end up buying. Sixty five kilometres to the litre.',
    specs: [{ label: 'Engine', value: '124cc' }, { label: 'Mileage', value: '65 kmpl' }, { label: 'Power', value: '10.5 PS' }, { label: 'Brakes', value: 'Disc' }, { label: 'Emission', value: 'BS6' }],
    highlights: ['Sixty five kilometres to the litre.', 'Disc brake at the front.', 'Easy EMI financing available.']
  },
  {
    id: 'rayzr', type: 'bike', brand: 'Yamaha', name: 'Yamaha RayZR 125 FI Hybrid', price: 316900, down: 0, img: IMG.rayzr,
    blurb: 'The most economical two wheeler here at seventy one kilometres to the litre, thanks to the hybrid assist.',
    specs: [{ label: 'Engine', value: '125cc' }, { label: 'Mileage', value: '71 kmpl' }, { label: 'Power', value: '8.2 PS' }, { label: 'System', value: 'Hybrid assist' }, { label: 'Fuel', value: 'Fuel injected' }],
    highlights: ['Seventy one kilometres to the litre, the best here.', 'Hybrid assist off the line.', 'Easy EMI financing available.']
  },
  {
    id: 'dio', type: 'bike', brand: 'Honda', name: 'Honda Dio 125', price: 325900, down: 0, img: IMG.dio,
    blurb: 'Honda’s automatic scooter, and our best selling two wheeler.',
    specs: [{ label: 'Engine', value: '286cc' }, { label: 'Mileage', value: '30 kmpl' }, { label: 'Power', value: '31 PS' }, { label: 'Brakes', value: 'Dual ABS' }],
    highlights: ['Our best selling two wheeler.', 'Dual channel ABS.', 'Easy EMI financing available.']
  },
  {
    id: 'apache', type: 'bike', brand: 'TVS', name: 'TVS Apache RTR 200 4V', price: 399900, down: 0, img: IMG.apache,
    blurb: 'Fuel injected, ABS equipped, and one of the quickest things in our two wheeler line up.',
    specs: [{ label: 'Engine', value: '197.75cc' }, { label: 'Mileage', value: '40 kmpl' }, { label: 'Power', value: '20.8 PS' }, { label: 'Brakes', value: 'FI with ABS' }],
    highlights: ['Twenty point eight horsepower.', 'Fuel injection with ABS.', 'Easy EMI financing available.']
  },
  {
    id: 'fzs', type: 'bike', brand: 'Yamaha', name: 'Yamaha FZS FI V3 Deluxe', price: 410900, down: 0, img: IMG.fzs,
    blurb: 'The deluxe FZS, with LED lighting and front ABS. Yamaha’s answer to the 150cc street bikes.',
    specs: [{ label: 'Engine', value: '149cc' }, { label: 'Mileage', value: '45 kmpl' }, { label: 'Power', value: '12.4 PS' }, { label: 'Brakes', value: 'Front ABS' }, { label: 'Lighting', value: 'Full LED' }],
    highlights: ['Full LED lighting on the deluxe trim.', 'Front channel ABS.', 'Easy EMI financing available.']
  },
  {
    id: 'ns200', type: 'bike', brand: 'Bajaj', name: 'Bajaj Pulsar NS 200', price: 451900, down: 0, img: IMG.ns200,
    blurb: 'Two hundred cc, dual channel ABS, and the most power of anything on this floor.',
    specs: [{ label: 'Engine', value: '199.5cc' }, { label: 'Mileage', value: '35 kmpl' }, { label: 'Power', value: '24.5 PS' }, { label: 'Brakes', value: 'Dual ABS' }],
    highlights: ['Twenty four and a half horsepower.', 'Dual channel ABS.', 'Easy EMI financing available.']
  }
];

async function seed() {
  console.log(`Starting seed to Sanity project m8sr7eub / dataset production...`);
  console.log(`Seeding ${VEHICLES.length} vehicles...`);

  let count = 0;
  for (const v of VEHICLES) {
    const doc = {
      _id: `vehicle-${v.id}`,
      _type: 'vehicle',
      name: v.name,
      id: { _type: 'slug', current: v.id },
      type: v.type,
      brand: v.brand,
      price: v.price ?? null,
      priceLabel: v.priceLabel || null,
      down: v.down ?? 0,
      status: v.status || null,
      imageUrl: v.img || null,
      blurb: v.blurb || '',
      seatsMin: v.seatsMin ?? null,
      seatsMax: v.seatsMax ?? null,
      ac: v.ac ?? false,
      specs: (v.specs || []).map((s) => ({
        _type: 'specItem',
        _key: Math.random().toString(36).substring(2, 9),
        label: s.label,
        value: s.value,
      })),
      highlights: v.highlights || [],
      order: ++count,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✓ [${count}/${VEHICLES.length}] Created/Updated: ${v.name} (${v.type})`);
    } catch (err) {
      console.error(`✗ Error creating ${v.name}:`, err.message);
    }
  }

  console.log(`\nSeeding Hero Slides...`);
  const HERO_SLIDES = [
    { id: 'kyc11', eyebrow: 'Electric vans' },
    { id: 'king16', eyebrow: 'The big one' },
    { id: 'g6', eyebrow: 'Electric cars' },
    { id: 'dfacEm26', eyebrow: 'On our floor now' },
    { id: 'e3g', eyebrow: 'Electric scooters' }
  ];

  let slideOrder = 0;
  for (const s of HERO_SLIDES) {
    slideOrder++;
    const slideDoc = {
      _id: `hero-slide-${s.id}`,
      _type: 'heroSlide',
      eyebrow: s.eyebrow,
      vehicle: {
        _type: 'reference',
        _ref: `vehicle-${s.id}`,
      },
      order: slideOrder,
    };
    try {
      await client.createOrReplace(slideDoc);
      console.log(`✓ Hero slide created: ${s.eyebrow}`);
    } catch (err) {
      console.error(`✗ Error creating slide ${s.eyebrow}:`, err.message);
    }
  }

  console.log(`\n🎉 Seed complete! ${count} vehicles and hero slides are live in your Sanity Studio.`);
}

seed().catch(console.error);
