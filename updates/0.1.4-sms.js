var smsConstants = require('../services/sms/smsConstants');

// exports.create = {
//     Sms: [
//         {
//             message :
//         }
//     ]
// };
exports.create = {
    Message : [
    {
        messageId :1,
        nor:'Noen har funnet "########", vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN.',
        dk:	'Nogen har fundet "########". Bekræft venligst modtagelsen af denne meddelelse ved at svare FANTN %%%%%%%% på denne meddelelse.',
        en:	'Someone has found "########", pls. confirm receipt of this message by replying FANTN %%%%%%%% to this text message. Regards FantN.',
        fr: 'Quelqu\'un a trouvé "########". S\'il vous plaît confirmer la réception de ce message en répondant à ce FANTN %%%%%%%% message texte. Salutations FantN.',
        gr:	'Jemand hat etwas gefunden, "########". Bitte bestätigen Sie den Empfang dieser Nachricht dadurch, daß Sie dieses SMS mit FANTN %%%%%%%% beantworten. Grüsse FantN.',
        pt: 'Alguém encontrou "########". Por favor confirme a receção desta mensagem respondendo a este texto de mensagem FANTN %%%%%%%%. Cumprimentos FantN.',
        es: 'Alguien ha encontrado "########". Favor confirme recepción de esta noticia SMS con la rispuesta FANTN %%%%%%%%. Saludos FantN',
        it: 'Qualcuno ha trovato "########". Si prega di confermare la ricezione di questo messaggio rispondendo a questo messaggio di testo FANTN %%%%%%%%. Saluti FantN.'
    },
    {
        messageId : 2,
        nor: 'Takk! Du har funnet noe som er mistet. Du vil bli kontaktet snart. Mvh FantN.',
        fr:'Merci! Vous avez trouvé quelque chose qui a été perdu. Vous serez contacté rapidement. Salutations FantN.',
        gr: 'Danke! Sie haben etwas verlorenes gefunden. Man wird sich demnächst mit Ihnen in Verbindung setzen. Grüsse FantN',
        it:'Grazie! Hai trovato qualcosa che è stato perso. Sarete contattati a breve. Saluti FantN.',
        pt: 'Obrigado! Encontrou algo que está perdido. Será contactado em breve. Cumprimentos FantN.',
        es: 'Gracias! Han encontrado algo perdido. Alguien le contactará dentro de poco. Saludos FantN.',
        dk: 'Tak! Du har fundet noget, som er mistet. Du vil snarest blive kontaktet. Venlig hilsen FantN.',
        en:'Thank you! You have found something that is lost. You will be contacted shortly. Regards FantN.',
    },

    {
        messageId : 4,
        nor: 'Takk for at du bekreftet at du har fått tilbake "noe du har mistet". Håper du er fornøyd. Mvh FantN.',
        fr:'Merci de confirmer que vous avez en main "quelque chose que vous avez perdu". Nous espérons que vous êtes satisfait de nos services. S\'agissant FantN.',
        gr: 'Danke für die Bestätigung, daß Sie "etwas verlorenes" wieder in Händen haben. Wir hoffen, daß Sie mit unserer Dienstleistung zufrieden sind. Grüsse FantN.',
        it:'Grazie per confermare la ricezione di "qualcosa che ti sei perso". Speriamo che siate soddisfatti dei nostri servizi. Saluti FantN.',
        pt: 'Muito obrigado por confirmar a receção de "algo que você perdeu". Esperamos que esteja satisfeito com os nossos serviços. Cumprimentos FantN.',
        es: 'Gracias por su confirmación que le han devuelto "algo perdído". Esperamos que nuestro servicio le haya llenado. Saludos FantN.',
        dk: 'Tak for at du har bekræftet, at du har fået "noget du har mistet" tilbage. Håber du er fornøjet.',
        en:'Thank you for confirming that you have in hand “something you have lost”. We hope that you are happy with our services. Regards FantN.',
    },

    {
        messageId: 5,
        nor: 'Takk for hjelpen. Ved å registrere deg på www.fantn.no med ditt telefonnummer og kode ###### vil du få et gratis medlemskap i 6 måneder. Velkommen som medlem. Mvh. FantN.',
        fr:'Merci pour l\'aide. Juste gagner 6 mois d\'abonnement gratuit sur Fantn en vous inscrivant dans www.fantn.no indiquant votre numéro de téléphone et le code ######. Bienvenue en tant que membre de la communauté FantN. Salutations FantN.',
        gr: 'Danke für Ihre Hilfe. Durch Ihre Anmeldung über www.fantn.no mit Ihrer Telefonnummer und der Kennzahl ###### haben Sie 6 Monate kostenlose Mitgliedschaft mit Fantn verdient. Grüße FantN.',
        it:'Grazie per l\'aiuto. Basta vincere 6 mesi di abbonamento gratuito Fantn iscrivendosi nel www.fantn.no indicando il vostro numero di telefono e il codice ######. Benvenuto come membro della comunità FantN. Saluti FantN',
        pt: 'Obrigado pela ajuda. Acabou de ganhar 6 meses de subscrição gratuita na Fantn por se ter registado em www.fantn.no indicando o seu número de telefone e o código ######. Seja bem vindo como membro da comunidade FantN. Cumprimentos FantN.',
        es: 'Gracias por su ayuda. Su registración a www.fantn.no con su número de teléfono y el código ###### resulta en 6 meses de membresía gratuita con FantN. Bienvenido como socio de la comunidad FantN. Saludos FantN.',
        dk: 'Tak for hjælpen. Registrerer du dig på www.fantn.no  med dit telefonnummer og kode ######, vil du få et gratis medlemskab i 6 måneder. Velkommen som medlem. Venlig hilsen FantN.',
        en:'Thanks for helping out. You have earned yourself 6 months free membership at Fantn by registering on www.fantn.no using your telephone number and the code ######. Welcome as a member in the FantN community. Regards FantN.',
    },
    {
        messageId: 3,
        nor: 'Vennligst kontakt finner på telefon ######## og avtal overlevering. Vennligst bekrefte mottak når overlevering har funnet sted ved å skanne FantN etiketten på nytt. Mvh FantN.',
        fr:'S\'il vous plaît contacter qui a découvert la liaison ######## pour organiser la livraison. S\'il vous plaît confirmer la livraison effective de numérisation de votre FantN de registre. Salutations FantN.',
        gr: 'Setzen Sie sich bitte mit dem Finder über ######## in Verbindung um die Übergabe zu koordinieren. Bitte bestätigen Sie die tatsächliche Übergabe durch scannen Ihres FantN Etiketts. Grüsse FantN',
        it:'Si prega di contattare che ha scoperto il collegamento ######## per organizzare la consegna. Si prega di confermare la consegna effettiva scansione del FantN Registro di sistema. Saluti FantN.',
        pt: 'Por favor contacte quem encontrou, ligando ######## para combinar a entrega. Por favor confirme a entrega efetiva digitalizando o seu registo FantN. Cumprimentos FantN.',
        es: 'Favor contactar con el descubridor bajo ######## para coordinar la entrega/devuelta. Favor confirmar la entrega definitiva por medio de un scan de su etiqueta FantN. Saludos FantN.',
        dk: 'Dansk: Kontakt venligst finderen på telefon ######## og aftal overlevering. Bekræft venligst faktuel overlevering ved at skanne din FantN label.',
        en:'Please contact the finder by calling ######## to make agreement for handover. Please confirm factual handover by scanning your FantN label. Regards FantN',
    },

    {
        messageId: smsConstants.msgIds.RETRY_NORMAL,
        nor: 'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        fr:'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        gr: 'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        it:'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        pt: 'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        es: 'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        dk: 'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN',
        en:'Noe som ######## har mistet er funnet, vennligst bekreft mottak av denne meldingen ved å svare FANTN %%%%%%%% på denne meldingen. Mvh FantN'
    },

    {
        messageId: smsConstants.msgIds.RETRY_FANTN,
        nor: 'SMS med serienummer: ######## har ikke mottatt noen bekreftelse',
        en:'SMS med serienummer: ######## har ikke mottatt noen bekreftelse'
    }
    ]
};
