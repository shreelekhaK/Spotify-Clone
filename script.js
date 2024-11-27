let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }
   
    const minutes = Math.floor(seconds / 60);

    // Calculate remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always show two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
  currFolder=folder;
  let a = await fetch(`/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
}

const playMusic = (track,pause=false) => {
  currentSong.src= `/${currFolder}/` + track;
  if(!pause){
    currentSong.play();
    play.src="pause.svg"
  }
  document.querySelector(".songinfo").innerHTML=decodeURI(track);
  document.querySelector(".songtime").innerHTML="00:00 / 00:00"
};
async function main() {
  //get the list of all the songs
  await getSongs("songs");
  playMusic(songs[0],true)

  //show all the songs in the playlist
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML=""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", "")}</div>
                                <div>siri</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
  }

  //attach an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //attach an event listener to play next and prev
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
    }else{
        currentSong.pause()
        play.src="play.svg"
    }

  })


  //listen for timeupdate event
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.
        currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector(".circle").style.left= percent+ "%";
    currentSong.currentTime=((currentSong.duration)*percent)/100;
  });

  //add an event listener for hamburger

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
  })

  //add an event listener for close button
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%";
  })

  //add an event listener to previous 
  previous.addEventListener("click",()=>{
    console.log("previous clicked")
    console.log(currentSong)
    let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index-1) >= 0){
        playMusic(songs[index-1]);
    }
  })
  
  //add an event listener to next
  next.addEventListener("click",()=>{
    console.log("next clicked")

    let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index+1) < songs.length){
        playMusic(songs[index+1]);
    }
  })

  //add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("setting volume to",e.target.value,"/ 100");
    currentSong.volume=parseInt(e.target.value)/100;
    if(currentSong.volume>0){
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }

  })
  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        console.log(item,item.currentTarget.dataset)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    })
  })

  //add an event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
  })




}
main();
