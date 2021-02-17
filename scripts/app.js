// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording

stop.disabled = true;

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    record.onclick = function() {
      //every two seconds
      mediaRecorder.start(2000);
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      //DO nothing for our case
    }

    mediaRecorder.ondataavailable = function(e) {
      console.log(e.data);
      var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
      xhr.open("POST","http://localhost:8080/recordings/upload?meeting_id=85649576594",true);
      xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTM1OTU2NTkuMjA5MDAxLCJzdWIiOiI2NDA4YjJkNS0yY2M5LTQxMjItYTA1MC1jYTYzNjdiMjEwNDUifQ.swXKpKZQqJkux4VMVSO9cQtBYy7TGzpsTNIPuFMnBNE")
		  xhr.send(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}
