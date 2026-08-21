/* Starter posts, written in the site's voice so the section is not empty on
   launch. Every one of them is a DRAFT for the counter to check: the figures
   come from the catalogue and the financing pages, but the advice is ours, not
   the showroom's, and should be read by someone who sells these before it goes
   out.

   The shape matches what a Sanity `post` document would return, so moving the
   source across later is a swap in one place rather than a rewrite:
     slug, title, excerpt, date (ISO), readMinutes, body (array of blocks) */

const BLOG_POSTS = [
  {
    slug: 'what-it-costs-to-run-an-electric-van',
    title: 'What it actually costs to run an electric van in Kathmandu',
    excerpt:
      'Diesel money against unit money, and the two bills people forget when they do the sum on the back of a receipt.',
    date: '2026-07-28',
    readMinutes: 4,
    body: [
      { h: 'The sum everyone does first' },
      {
        p: 'A diesel van doing the Panipokhari to Bhaktapur run burns a tank a week, and the tank is the number people compare. Charging the same route costs a fraction of it. That much is true and it is the reason most of our van customers walk in.',
      },
      {
        p: 'It is also the easy half of the sum. The harder half is what the vehicle costs you when it is not moving, and that is where the two kinds of van really separate.',
      },
      { h: 'The bills people leave out' },
      {
        p: 'Servicing is the first. An electric drivetrain has no oil to change, no filters, no timing belt. Over five years that is a meaningful stack of workshop visits that simply do not happen.',
      },
      {
        p: 'The second is the battery, and it goes the other way. It is the single most expensive part of the vehicle, and it is the one that ages whether you drive or not. Ask what the warranty covers, for how many years, and whether it is capacity based. Get the answer in writing.',
      },
      { h: 'What to ask us at the counter' },
      {
        p: 'Bring your actual route and your actual monthly distance. The honest comparison is not diesel against electric in general, it is your run against your run, with your downpayment and your term. That is a ten minute conversation at Panipokhari and it is worth having before you sign anything.',
      },
    ],
  },
  {
    slug: 'eleven-fourteen-or-sixteen-seats',
    title: 'Eleven, fourteen or sixteen seats: how operators actually choose',
    excerpt:
      'More seats is not more money if you cannot fill them. What school routes, staff runs and tour operators each end up buying.',
    date: '2026-07-14',
    readMinutes: 3,
    body: [
      { h: 'Seats you cannot fill are weight you are paying for' },
      {
        p: 'The instinct is to buy the biggest van the loan will carry. It is usually wrong. Every empty seat is mass you are moving, range you are spending and a payment you are making against income that is not arriving.',
      },
      { h: 'What each route tends to settle on' },
      {
        p: 'School routes generally land on eleven. The run is short, it is twice a day, and the parents are fixed, so the operator knows the number before buying and buys exactly that.',
      },
      {
        p: 'Staff transport tends toward fourteen. Companies add people faster than they remove them, and the headcount that fills a van in January rarely fills it in December.',
      },
      {
        p: 'Tour operators are the ones who genuinely need sixteen and up. Groups arrive as groups, and turning one away because two seats are missing costs more than the larger van ever did.',
      },
      { h: 'The one that catches people out' },
      {
        p: 'Air conditioning. On a school run it is close to optional. On a six hour tour it is the difference between a repeat booking and a complaint, and it is not something you can add afterwards.',
      },
    ],
  },
  {
    slug: 'what-to-bring-for-vehicle-finance',
    title: 'What to bring to the counter for vehicle finance',
    excerpt:
      'The document list, why the bank wants each one, and the two that hold most files up.',
    date: '2026-06-30',
    readMinutes: 3,
    body: [
      { h: 'The list' },
      {
        p: 'Citizenship certificate, original and a photocopy. PAN card if you have one registered. Proof of income. Six months of bank statements. Two recent passport photographs. A driving licence valid for the category you are buying.',
      },
      { h: 'Why the bank asks for each' },
      {
        p: 'Everything on that list is answering one question: can you make the monthly payment for the length of the term. Citizenship and the licence establish who you are and that you may legally drive it. The statements and the income proof establish the rest.',
      },
      { h: 'The two that hold files up' },
      {
        p: 'Income proof, for anyone self employed. A salary slip is straightforward; a business needs its registration and an audit report, and those take time to gather. Start on it before you come in.',
      },
      {
        p: 'Bank statements, when the account does not show the income the application claims. If your business runs largely in cash, talk to us before applying rather than after being declined — there are ways to structure it, but they need to be arranged at the start.',
      },
      { h: 'How long it takes' },
      {
        p: 'With the file complete, most applications are approved inside three working days. The counter calls the same working day it is submitted.',
      },
    ],
  },
];

export { BLOG_POSTS };
