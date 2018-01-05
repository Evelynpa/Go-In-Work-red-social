window.onload = initialize;
// Declaración de variables
  var file;
  var btnsend;
  var storageRef;
  var imageRef;
  var textoNotice;
  var txtNoticeRef;
  var message;
  var txtMessage;
  var txtMessageTwo;
  var btnSendMessage;
  var btnSendMessageTwo;


function initialize(){// Funcion de autoejecutarse desde el BOM
	$('#modalLogin').modal({show: true, backdrop: 'static', keyboard: false});

	// muestra imagenes automatico
	file = document.getElementById('fichero');//input file
	btnsend = document.getElementById('publishNews');

	btnsend.addEventListener('click', upImageToFirebase);// llama a la funcion para que se ejecute al autocargarse
	storageRef = firebase.storage().ref();//referencia a storage directorio de imagenes
	imageRef = firebase.database().ref().child('images');//referencia de lugar de imagenes en la base de datos

	showImageToFirebase();

	//muestra textos automatico
	textoNotice = document.getElementById('txtNotices');//input text
	txtNoticeRef = firebase.database().ref().child('publicaciones');//referencia de lugar de mensajes en la base de datos
	showTextToFirebase();
	showTextInterToFirebase();
	showTextInterTwoToFirebase();

}
	// Obtener Id para autentificación
 	const txtemail = document.getElementById('email');
	const txtcontraseña = document.getElementById('password');
	const btnlogin = document.getElementById('logIn');
	const btnsignup = document.getElementById('signUp');
	const btnlogout = document.getElementById('logOut');

	$(btnlogin).prop('disabled', true);
	$(btnsignup).prop('disabled', true);

	txtcontraseña.addEventListener('keyup', function(){// Valida Campos vacios
		if (txtemail.length <= 0 || txtcontraseña.length <= 0) {
			$(btnlogin).prop('disabled', true);
			$(btnsignup).prop('disabled', true);
		}else {
			$(btnlogin).prop('disabled', false);
			$(btnsignup).prop('disabled', false);
		}
		
	
	});

(function(){// Autofunción
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

			function addUserToBD(uid, name, fecha){// Agrega usuarios a la base de datos		
					var conect = userconect.push({
					uid: uid,
					name: name,
					fecha: fecha
				});		
			}

				

})();
// SUBIR IMÁGENES
function upImageToFirebase(){// funcion para subir imágenes
	var imageToUp = file.files[0];
	var uploadTask = storageRef.child('images/' + imageToUp.name).put(imageToUp);

	uploadTask.on('state_changed', function(snapshot){// Cambio en el estado de la subida del file
		//se va mostrando el progreso de la subida de imagen
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		/* console.log('Upload is ' + progress + '% done');*/
		switch (snapshot.state) {
		case firebase.storage.TaskState.PAUSED: // or 'paused'
		 /*console.log('Upload is paused');*/
		break;
		case firebase.storage.TaskState.RUNNING: // or 'running'
		/*console.log('Upload is running');*/
		break;
		}
		}, function(error) {
		// verificar error si existe
		}, function() {
		// Cuando se ha subido exitosamente la imagen
		var downloadURL = uploadTask.snapshot.downloadURL;
		console.log(downloadURL);
		createNodeInDatabase(imageToUp.name, downloadURL);
	});
	addText(textoNotice);
					
}

// Función crear nodo json en base de datos
function createNodeInDatabase(nameImage, downloadURL){
	imageRef.push({
		nombre: nameImage, 
		url: downloadURL
	});
}

// Función MOSTRAR IMAGEN
function showImageToFirebase(){
	imageRef.on('value', function(snapshot){
		var datos = snapshot.val();
		var result = '';
		const email = txtemail.value;		
		for (var key in datos) {
			result += "<p class='publicaciones'>Se ha publicado la siguiente imagen:</p><img src=" + datos[key].url + " class='imgMuro'/>";
		}
		$('#muro').html(result);
		console.log(email);
						
	});
}
//Función agregar textos 
function addText(message){
	//datos del campo de texto
	var camp =	textoNotice.value;
	txtNoticeRef.push({
		message: camp
	});
}

//Funcion mostrar datos
function showTextToFirebase(){
		txtNoticeRef.on('value', function(snapshot){
			var datos = snapshot.val();
			var textCamp = '';
								
			for (var key in datos) {                         
				textCamp += "<p class='publicaciones'>Se ha publicado la siguiente texto:</p><p class='publicaciones'>" + datos[key].message + " </p>";
			}
 			$('#muro').append(textCamp);
 			console.log(datos);
	});
}

	// mostrar mensaje interno
	txtMessage = document.getElementById('txtMessage');//input text modal
	txtMessageTwo = document.getElementById('txtMessageTwo');//input text modal
	btnSendMessage = document.getElementById('sendMessage');//boton modal 1
	btnSendMessageTwo = document.getElementById('sendMessageTwo');//boton  modal 2
	txtMessageInternoRef = firebase.database().ref().child('mensajeInterno');//referencia de lugar de mensajes en la base de datos

// Funcion para guardar datos en la base de datos
btnSendMessage.addEventListener('click', function(message){
	//datos del campo de texto
	var camp =	txtMessage.value;
	if(camp.length <= 0){
		alert('Debe llenar campo');
	}else {
		txtMessageInternoRef.push({
		message: camp
	});
		document.getElementById('txtMessage').value = '';
	}
});
// Funcion para guardar datos en la base de datos de modal 2
btnSendMessageTwo.addEventListener('click', function(message){
	//datos del campo de texto
	var camp =	txtMessageTwo.value;
	if(camp.length <= 0){
		alert('Debe llenar campo');
	}else {
		txtMessageInternoRef.push({
		message: camp
	});
	document.getElementById('txtMessageTwo').value = '';
	}
	
});

//Funcion mostrar datos interno
function showTextInterToFirebase(){
		txtMessageInternoRef.on('value', function(snapshot){
			var datos = snapshot.val();
			var textCamp = '';
								
			for (var key in datos) {                         
				textCamp += "<p class='msn'>"+ datos[key].message+ "</p>";
			}
 			$('#textTwo').html(textCamp);
	});
}
//Funcion mostrar datos interno
function showTextInterTwoToFirebase(){
		txtMessageInternoRef.on('value', function(snapshot){
			var datos = snapshot.val();
			var textCamp = '';
								
			for (var key in datos) {                         
				textCamp += "<p class='msn'>"+ datos[key].message+ "</p>";
			}
 			$('#textOne').html(textCamp);
	});
}


function colors(){
	var disponible = document.getElementById('mySelect').value; 
	if(disponible.value = 'Disponible'){
		document.getElementById('userPhoto').style.border = '5px solid green'; 
	}else if(disponible.value = 'Ocupado'){
		document.getElementById('userPhoto').style.border = '5px solid red'; 
	}else if(disponible.value = 'Ausente'){
		document.getElementById('userPhoto').style.border = '5px solid yellow'; 
	}
	
	
};
