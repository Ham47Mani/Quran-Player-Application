// ====================================== Start Quran Application ======================================
const audio = document.querySelector(".quran .quranPlayer"),
      surahsContainer = document.querySelector(".quran .surahs"),
      ayah = document.querySelector(".quran .ayah"),
      play = document.querySelector(".quran .buttons .play"),
      next = document.querySelector(".quran .buttons .next"),
      prev = document.querySelector(".quran .buttons .prev");

//- Call getSurahs Function
getSurahs();


//- getSurahs Function
function getSurahs () {
  //- Fetvh To Get Surahs
  fetch(`https://api.quran.sutanlab.id/surah`)
  .then(response => response.json())
  .then(response => {
    for (let surah in response.data) {
      surahsContainer.innerHTML += `
        <div class="">
          <p>${response.data[surah].name.long}</p>
          <p>${response.data[surah].name.transliteration.en}</p>
        </div>
      `;
    }
    //- Select All Surahs
    let surahs = surahsContainer.querySelectorAll("div");
    let ayahsAudios, ayahsText;

    surahs.forEach((surah, index) => {
      surah.addEventListener("click", () => {
        fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
        .then(response => response.json())
        .then(response => {
          let verses = response.data.verses;
          ayahsAudios = [];
          ayahsText = [];

          verses.forEach(verse => {
            ayahsText.push(verse.text.arab);
            ayahsAudios.push(verse.audio.primary);
          });
          let ayahIndex = 0;
          //- Call changeAyah Function 
          changeAyah(ayahIndex);

          //- Add End Audio Events 
          audio.addEventListener("ended", () => {
            ayahIndex++
            if (ayahIndex < ayahsText.length ) {
              changeAyah(ayahIndex);
            } else {
              ayahIndex = 0;
              changeAyah(ayahIndex);
              audio.pause();

              //- Sweet Alert
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'إنتهـت السـورة',
                showConfirmButton: false,
                timer: 1500
              });
              isPlaying = true;
              togglePlay();

            }
          });
          //- Next Button Event
          next.addEventListener("click", () => {
            (ayahIndex < ayahsText.length - 1) ? ayahIndex++ : ayahIndex = 0;
            changeAyah(ayahIndex);
          });
          //- Previous Button Event
          prev.addEventListener("click", () => {
            (ayahIndex == 0) ? ayahIndex = ayahsText.length - 1 : ayahIndex--;
            changeAyah(ayahIndex);
          });

          //- Check Play
          let isPlaying = false;
          togglePlay();
          function togglePlay () {
            if (isPlaying) {
              audio.pause();
              play.innerHTML = `
                <i class="fas fa-play"></i>
              `;
              isPlaying = false;
            } else {
              audio.play();
              play.innerHTML = `
                <i class="fas fa-pause"></i>
              `;
              isPlaying = true;
            }
          }

          //- Play Button Event
          play.addEventListener("click", togglePlay);
          

          //- changeAyah Function
          function changeAyah (index) {
            audio.src = ayahsAudios[index];
            ayah.innerHTML = ayahsText[index];
          }
        });
      });
    });
  });
}
// ====================================== End Quran Application ======================================