window.onload = function() {
  $('#modalLogin').modal({show: true, backdrop: 'static', keyboard: false});
};

 	const txtemail = document.getElementById('email');
	  const txtcontraseña = document.getElementById('password');
	  const btnlogin = document.getElementById('logIn');
	  const btnsignup = document.getElementById('signUp');
	  const btnlogout = document.getElementById('logOut');
	$(btnlogin).prop('disabled', true);
	$(btnsignup).prop('disabled', true);

	txtcontraseña.addEventListener('keyup', function(){
		if (txtemail.length <= 0 || txtcontraseña.length <= 0) {
			$(btnlogin).prop('disabled', true);
			$(btnsignup).prop('disabled', true);
		}else {
			$(btnlogin).prop('disabled', false);
			$(btnsignup).prop('disabled', false);
		}
		
	
	});

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

	  var database = firebase.database();
	  var userconect = null;

		  btnlogin.addEventListener('click', e =>{
		  	//obtener email y password
		  	const email = txtemail.value;
		  	const pass = txtcontraseña.value;
		  	const auth = firebase.auth();
		  	//entrar
			const promise = auth.signInWithEmailAndPassword(email, pass);
			promise.catch( e => console.log(e.message));//detecta si existe error
		 	  	
		  	
		  });

		  btnsignup.addEventListener('click', e =>{
		  //crear email y password
		  	const email = txtemail.value;
		  	const pass = txtcontraseña.value;
		  	const auth = firebase.auth();
			//entrar
			const promise = auth.createUserWithEmailAndPassword(email, pass);
			
		  	promise.catch( e => console.log(e.message));//mensaje en caso de 'No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado.'	  	
		  });

		  	btnlogout.addEventListener('click', e => {
		  		firebase.auth().signUp();
		  	});

		  	//logear en tiempo real
		  	firebase.auth().onAuthStateChanged(firebaseUser =>{
		  		if(firebaseUser){
					const email = txtemail.value;
				  	const pass = txtcontraseña.value;

					addNewContact();
		  			console.log(firebaseUser);
		  			/*btnlogout.removeClass('hide');*/
		  			var formatoFecha = new Date();
					var d =formatoFecha.getUTCDate();
					var m =formatoFecha.getMonth()+1;
					var y =formatoFecha.getFullYear();
					var h =formatoFecha.getHours();
					var min =formatoFecha.getMinutes();

					var fecha = d+"/"+m+"/"+y+" "+h+":"+min;


		  			userconect = database.ref('/user');
		  			addUserToBD(firebaseUser.uid, firebaseUser.email, fecha);

		  		}else {
		  			console.log('no se ha logeado');
		  			btnlogout.classList.add('hide');
		  		}
		  	})

			function addUserToBD(uid, name, fecha){		
					var conect = userconect.push({
					uid: uid,
					name: name,
					fecha: fecha
				})		
			}

			//subir imagenes
			var file = document.getElementById('fichero');
			file.addEventListener('change', upImageToFirebase);

			storageRef = firebase.storage().ref();


			function upImageToFirebase(){
				var imageToUp = file.files[0];
				var uploadTAsk = storageRef.child('images/' + imageToUp.name).put(imageToUp);
			}
})();

/*$(document).ready(function() {

	$("#imagen").on("change", function() {
    if(typeof(FileReader) != undefined){
      var preview = $("#preview");
      preview.empty();

      var reader = new FileReader();
        reader.onload = function(e){
          $("#preview").attr("src", e.target.result);
        }

      reader.readAsDataURL($(this)[0].files[0]);
 
    }else{
      console.log("Formato desconocido");
    }
    
  });
  });*/