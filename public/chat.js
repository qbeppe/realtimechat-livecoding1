//alert("ciao");

// Your web app's Firebase configuration.
/* TODO: Inserire qui le configurazioni di Firebase.
    Dalla pagina del progetto su Firebase, le impostazioni si trovano sotto "SDK setup and configuration".
    Utilizzata qui la modalità CDN : Load Firebase JavaScript SDK libraries from the CDN (content delivery network).
*/
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
var user = null;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
//var database = firebase.database();
const database = firebase.database();

const actualDateTime = function() {
  var dt = new Date();
  return `${dt.getFullYear().toString().padStart(4, '0')}
  /${(dt.getMonth()+1).toString().padStart(2, '0')}
  /${dt.getDate().toString().padStart(2, '0')}
   ${dt.getHours().toString().padStart(2, '0')}
  :${dt.getMinutes().toString().padStart(2, '0')}
  :${dt.getSeconds().toString().padStart(2, '0')}`;
}

const inviaMessaggio = function() {
  // 01.00
  // console.log("Invia messaggio");
  // 01.01
  const nick = document.getElementById("nickname").value;
  const testo = document.getElementById("boxTesto").value;
  if(testo && nick) {
    // 01.01a aggiunta la pulizia del box
    document.getElementById("boxTesto").value="";
    //
    let chatRef = database.ref('chat');
    // A Firebase solo testo.
    //chatRef.push(testo);
    // A Firebase nick+testo.
    chatRef.push({
      nick: nick,
      testo: testo,
	    time: actualDateTime()
    });
    //
    console.log("Invia messaggio: ", testo);
  } else {
    alert(`Per inviare, inserire sia Nickname che Testo.`);
  };
}

const userLogin = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    // Nasconde il button login.
    document.getElementById("loginButton").style.visibility = "hidden";
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    // + Si rende user globale perché si autentichi un a volta sola.
    //var user = result.user;
    user = result.user;
    // ...
    document.getElementById("nickname").value = user.displayName;
  }).catch((error) => {
    console.log(`>>> userLogin() ... ko`)
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log(`>>> userLogin()
      eCode:${errorCode}
      eMsg:${errorMessage}
      eMail${email}
      eCred${credential}`)
  });
}

const inserisciMessaggi = function(messaggi) {
  //<li class="list-group-item">msg 00</li>
  let messaggiFormattati = "";
  messaggi.forEach(function(messaggio) {
    // Versione con solo testo, una stringa.
    ////messaggiFormattati += '<li class="list-group-item">'+messaggio+'</li>';
    //messaggiFormattati += `<li class="list-group-item">${messaggio}</li>`;
    // Versione con nick+testo, un oggetto.
    messaggiFormattati += `<li class="list-group-item">
      ${messaggio.nick}: ${messaggio.testo}
      <br />
      <span style="font-size:8px">${messaggio.time ? messaggio.time : ""}</span>
      </li>`;

  });
  document.getElementById("listaMessaggi").innerHTML = messaggiFormattati;
  //console.log(messaggiFormattati);
}

//database.ref('chat').on('value', function(snapshot) {
database.ref('chat').on('value', (snapshot) => {
  const data = snapshot.val();
  //000
  //console.log(`snatpshot:` , data);
  //001
  //Object.keys(data).forEach(function(key) {
  //  console.log(`dati snatpshot --->` , data[key]);
  //});
  //002
  const datiFormattati = [];
  Object.keys(data).reverse().forEach(function(key) {
    datiFormattati.push(data[key]);
  });
  inserisciMessaggi(datiFormattati);
});

firebase.auth().onAuthStateChanged(function(loggedUser) {
  if (loggedUser) {
    // User is signed in.
    document.getElementById("loginButton").style.visibility = "hidden";
    user = loggedUser;
    document.getElementById("nickname").value = user.displayName;
  } else {
    // No user is signed in.
  }
});



// Scrittura di test.
//const msg = [
//"msg 00" , "msg 01" , "msg 02"
//];
//inserisciMessaggi(msg);