// $(document).ready(function() {
	
// });
window.onload = function() {
  $('#modalLogin').modal('show');
};
(function(){
	 // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyBNo16Sb_f7GXDGtPCamNSURa0vVr2Hzmo",
	    authDomain: "go-in-work.firebaseapp.com",
	    databaseURL: "https://go-in-work.firebaseio.com",
	    projectId: "go-in-work",
	    storageBucket: "go-in-work.appspot.com",
	    messagingSenderId: "518892409142"
	  };
	  firebase.initializeApp(config);
	  var txtemail = $('#email').val();
	  var txtcontraseña = $('#password').val();
	  var btnlogin = document.getElementById('#logIn');
	  var btnsignup = document.getElementById('#signUp');
	  var btnlogout = document.getElementById('#logOut');

	  btnlogin.addEventListener('click', function(){
	  	//obtener email y password
	  	const email = txtemail.value;
	  	const pass = txtcontraseña.value;
	  	const auth = firebase.auth();

	  	//entrar
	  	const promise = auth.signInWithEmailAndPassword(email, pass);
	  	promise.catch(function(e){
           e.message;
	  	});
	  });

	btnsignup.addEventListener('click', function(){
	  //crear email y password
	  	const email = txtemail.value;
	  	const pass = txtcontraseña.value;
	  	const auth = firebase.auth();

	  	//entrar
	  	const promise = auth.createUserWithEmailAndPassword(email, pass);
	  	/*promise.then(function(){
	  		
	  	})*/
	  	promise.catch(function(e){
           e.message;
	  	});

	  	btnlogout.addEventListener('click', function(e){
	  		firebase.auth().signUp();
	  	});

	  	//logear en tiempo real
	  	firebase.auth().onAuthStateChanged(function(fireBaseUser){
	  		if(fireBaseUser){
	  			console.log(fireBaseUser);
	  		}else {
	  			console.log('no se halogeado');
	  		}
	  	})

	  });




	

	}());
