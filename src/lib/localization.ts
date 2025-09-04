interface LocalizedStrings {
  // Game flow
  welcome: string;
  gameDescription: string;
  startGame: string;
  showLeaderboard: string;
  debugResult: string;
  
  // New start screen content
  mainOffer: string;
  mainOfferSubtext: string;
  instructions: string;
  discountNote: string;
  discountCode: string;
  enterName: string;
  enterEmail: string;
  iAm: string;
  guestVisitor: string;
  hairdressingStudent: string;
  foreignHairdresser: string;
  acceptMarketing: string;
  readySetRecycle: string;
  scoreboard: string;
  tapToPlay: string;
  
  // Terms and conditions
  termsTitle: string;
  termsContent: string;
  
  // Error messages
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  roleRequired: string;
  marketingRequired: string;
  
  // Countdown/Instructions
  howToPlayTitle: string;
  howToPlaySubtitle: string;
  gameInstructions: string;
  scoringRules: string;
  parkPackaging: string;
  trash: string;
  postGameInfo: string;
  postGameInfo2: string;
  postGameInfo3: string;
  postGameInfo4: string;
  readyQuestion: string;
  
  // Results
  congratulations: string;
  yourScore: string;
  playAgain: string;
  viewLeaderboard: string;
  wellPlayed: string;
  youCollected: string;
  raffleText: string;
  discountText: string;
  compareText: string;
  dailyWinnerText: string;
  wantToSee: string;
  dailyWinner: string;
  discountBanner: string;
  discountDetails: string;
  
  // Leaderboard
  leaderboard: string;
  rank: string;
  player: string;
  score: string;
  backToStart: string;
}

const danishStrings: LocalizedStrings = {
  // Game flow
  welcome: "Velkommen til PARK Spillet!",
  gameDescription: "Fang flasker og undgå skrald for at vinde fantastiske præmier!",
  startGame: "Start Spil",
  showLeaderboard: "Se Leaderboard",
  debugResult: "🐛 Debug Result Screen",
  
  // New start screen content
  mainOffer: "VIND EN AIRSTYLER +",
  mainOfferSubtext: "5000 kr. TIL PARK PRODUKTER",
  instructions: "Skriv dit navn og mail og start spillet for at deltage",
  discountNote: "PS: Alle deltagere får en 15% rabatkode som tak",
  discountCode: "15% rabatkode",
  enterName: "Indtast dit navn",
  enterEmail: "Indtast din email",
  iAm: "Jeg er..",
  guestVisitor: "Gæst/besøgende",
  hairdressingStudent: "Frisørelev eller frisørassistent i Danmark",
  foreignHairdresser: "Frisør/salon fra udlandet",
  acceptMarketing: "Jeg accepterer at modtage markedsføring fra PARK",
  readySetRecycle: "Klar, parat, pant!",
  scoreboard: "Scoreboard",
  tapToPlay: "Tryk for at spille",
  
  // Terms and conditions
  termsTitle: "Konkurrencebetingelser – PARK Styling",
  termsContent: `Arrangør
Konkurrencen arrangeres af PARK Styling A/S, CVR 39386984, Østergade 9, 6000 Kolding. Konkurrencen gælder kun i Danmark og er underlagt dansk ret.

Periode
Konkurrencen løber fra 9. til og med 12. september 2025.

Deltagelse
• Deltagelse sker ved at scanne en QR-kode, udfylde navn, e-mail og rolle (frisørstuderende/udlært, frisør fra udlandet eller gæst/besøgende), acceptere betingelserne og spille spillet Indsaml pant.
• Spillet giver +20 point for rigtige flasker og –10 point for forkerte flasker.
• Der er ingen aldersbegrænsning.
• Ansatte hos PARK Styling og samarbejdspartnere kan ikke deltage.
• Man kan deltage ubegrænset antal gange pr. dag.
• Navn og e-mail skal være gyldige.

Præmier
• Hver dag vinder den deltager med flest point et gavekort på 500 kr. (i alt 4 stk.).
• Blandt alle deltagere trækkes lod om én airstyler samt ét gavekort på 5.000 kr. til webshoppen.
• Alle deltagere modtager en rabatkode på 15 % til webshoppen.
• Præmier er personlige, kan ikke ombyttes til kontanter eller andre produkter og udleveres som digitale koder via e-mail.
• Eventuelle skattemæssige forhold er deltagerens eget ansvar.
• Vindere kontaktes via den oplyste e-mail.

Data og markedsføring
• Ved deltagelse accepterer man, at PARK Styling registrerer navn, e-mail og rolle.
• Oplysninger bruges til udsendelse af nyhedsbreve og markedsføring via Klaviyo.
• Man kan til enhver tid afmelde nyhedsbreve via link i e-mails.
• Konkurrencedata gemmes i op til 12 måneder. Tilmelding til nyhedsbrev gælder, indtil deltageren selv afmelder det.

Ansvar og begrænsninger
• PARK Styling er ikke ansvarlig for tekniske fejl, der hindrer deltagelse.
• Der tilbydes ikke erstatningspræmier.
• PARK Stylings afgørelser om vindere er endelige og kan ikke indklages.
• Deltageren er selv ansvarlig for at oplyse korrekte kontaktoplysninger.`,
  
  // Error messages
  nameRequired: "Navn er påkrævet",
  emailRequired: "E-mail er påkrævet",
  emailInvalid: "Indtast en gyldig e-mail adresse",
  roleRequired: "Vælg din rolle",
  marketingRequired: "Du skal acceptere markedsføring for at deltage",
  
  // Countdown/Instructions
  howToPlayTitle: "SÅDAN SPILLER DU OG",
  howToPlaySubtitle: "DELTAGER I KONKURRENCEN",
  gameInstructions: "Du har 40 sekunder - saml så meget",
  gameInstructions2: "pant som muligt!",
  scoringRules: "PARK emballage = +20 kr.",
  trash: "Skrald = -10 kr.",
  postGameInfo: "Når tiden er gået, ser du din score og",
  postGameInfo2: "deltager automatisk i konkurrencen -",
  postGameInfo3: "måske er der også en ekstra gave der",
  postGameInfo4: "venter på dig?",
  readyQuestion: "Er du klar?",
  
  // Results
  congratulations: "Tillykke!",
  yourScore: "Din Score:",
  playAgain: "Spil Igen",
  viewLeaderboard: "Se Leaderboard",
  wellPlayed: "GODT SPILLET",
  youCollected: "Du samlede i alt pant for",
  raffleText: "Du er nu med i lodtrækningen om en PARK Pro Airstyler + PARK produkter for 5.000 kr.",
  discountText: "Alle deltagere får en rabatkode på 15% til webshoppen",
  compareText: "Sammenlign din score med andre deltagere",
  dailyWinnerText: "Dagens nr. 1 vinder et gavekort på 500 kr",
  wantToSee: "Vil du se, hvordan du klarer dig mod de andre?",
  dailyWinner: "Dagens nr. 1 vinder et gavekort på 500 kr",
  discountBanner: "15% TIL DIG",
  discountDetails: "Tak for indsatsen – du har fået en rabatkode på 15% til hele webshoppen. Tjek din mail",
  
  // Leaderboard
  leaderboard: "Leaderboard",
  rank: "Plads",
  player: "Spiller",
  score: "Score",
  backToStart: "Tilbage til Start"
};

const englishStrings: LocalizedStrings = {
  // Game flow
  welcome: "Welcome to PARK Game!",
  gameDescription: "Catch bottles and avoid trash to win amazing prizes!",
  startGame: "Start Game",
  showLeaderboard: "Show Leaderboard",
  debugResult: "🐛 Debug Result Screen",
  
  // New start screen content
  mainOffer: "WIN AN AIRSTYLER +",
  mainOfferSubtext: "5000 kr. FOR PARK PRODUCTS",
  instructions: "Write your name and email and start the game to participate",
  discountNote: "PS: All participants receive a 15% discount code as a thank you",
  discountCode: "15% discount code",
  enterName: "Enter your name",
  enterEmail: "Enter your email",
  iAm: "I am..",
  guestVisitor: "Guest/visitor",
  hairdressingStudent: "Hairdressing student or assistant in Denmark",
  foreignHairdresser: "Hairdresser/salon from abroad",
  acceptMarketing: "I accept to receive marketing from PARK",
  readySetRecycle: "Ready, set, recycle!",
  scoreboard: "Scoreboard",
  tapToPlay: "Tap to play",
  
  // Terms and conditions
  termsTitle: "Competition Terms – PARK Styling",
  termsContent: `Organizer
The competition is organized by PARK Styling A/S, CVR 39386984, Østergade 9, 6000 Kolding. The competition is only valid in Denmark and is subject to Danish law.

Period
The competition runs from September 9th to September 12th, 2025.

Participation
• Participation occurs by scanning a QR code, filling in name, email and role (hairdressing student/graduate, hairdresser from abroad or guest/visitor), accepting the terms and playing the game Collect deposit.
• The game gives +20 points for correct bottles and –10 points for incorrect bottles.
• There is no age restriction.
• Employees at PARK Styling and partners cannot participate.
• You can participate unlimited times per day.
• Name and email must be valid.

Prizes
• Each day, the participant with the most points wins a gift card of 500 kr. (4 in total).
• Among all participants, lots are drawn for one airstyler and one gift card of 5,000 kr. for the webshop.
• All participants receive a 15% discount code for the webshop.
• Prizes are personal, cannot be exchanged for cash or other products and are delivered as digital codes via email.
• Any tax matters are the participant's own responsibility.
• Winners are contacted via the provided email.

Data and marketing
• By participating, you accept that PARK Styling registers name, email and role.
• Information is used for sending newsletters and marketing via Klaviyo.
• You can unsubscribe from newsletters at any time via link in emails.
• Competition data is stored for up to 12 months. Newsletter subscription applies until the participant unsubscribes themselves.

Responsibility and limitations
• PARK Styling is not responsible for technical errors that prevent participation.
• No replacement prizes are offered.
• PARK Styling's decisions about winners are final and cannot be appealed.
• The participant is responsible for providing correct contact information.`,
  
  // Error messages
  nameRequired: "Name is required",
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  roleRequired: "Please select your role",
  marketingRequired: "You must accept marketing to participate",
  
  // Countdown/Instructions
  howToPlayTitle: "HOW TO PLAY AND",
  howToPlaySubtitle: "PARTICIPATE IN THE COMPETITION",
  gameInstructions: "You have 40 seconds - collect as much",
  gameInstructions2: "deposit as possible!",
  scoringRules: "PARK packaging = +20 kr.",
  trash: "Trash = -10 kr.",
  postGameInfo: "When time is up, you see your score and",
  postGameInfo2: "automatically participate in the competition -",
  postGameInfo3: "maybe there's also an extra gift that",
  postGameInfo4: "awaits you?",
  readyQuestion: "Are you ready?",
  
  // Results
  congratulations: "Congratulations!",
  yourScore: "Your Score:",
  playAgain: "Play Again",
  viewLeaderboard: "View Leaderboard",
  wellPlayed: "WELL PLAYED",
  youCollected: "You collected a total of deposit for",
  raffleText: "You are now in the draw for a PARK Pro Airstyler + PARK products for 5,000 kr.",
  discountText: "All participants receive a 15% discount code for the webshop",
  compareText: "Compare your score with other participants",
  dailyWinnerText: "Today's #1 winner gets a gift card for 500 kr",
  wantToSee: "Do you want to see how you compare to others?",
  dailyWinner: "Today's #1 winner gets a gift card for 500 kr",
  discountBanner: "15% FOR YOU",
  discountDetails: "Thanks for your effort – you have received a discount code of 15% for the entire webshop. Check your email",
  
  // Leaderboard
  leaderboard: "Leaderboard",
  rank: "Rank",
  player: "Player",
  score: "Score",
  backToStart: "Back to Start"
};

class LocalizationManager {
  private currentLocale: string = 'da';
  
  setLocale(locale: string) {
    this.currentLocale = locale;
  }
  
  getLocale(): string {
    return this.currentLocale;
  }
  
  getStrings(): LocalizedStrings {
    return this.currentLocale === 'en' ? englishStrings : danishStrings;
  }
}

export const localization = new LocalizationManager();