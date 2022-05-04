/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ pause / seek
 * 4. CD rotate
 * 5. Next/ Prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const PLAYER_STORAGE_KEY = 'BAO_PLAYER'
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist') 
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const h2 = $('header h2')
const h4 = $('header h4')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const repeatBtn = $('.btn-repeat')
const randomtBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying : false,
    isRepeat : false,
    isRandom : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            image: 'img/Nevada.jpg',
            path : 'img/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3'
        },
        {
            name: 'Way Back',
            singer: 'Vicetone Cozi Zuehlsdorff',
            image: 'img/Way_Back.jpg',
            path : 'img/Way Back - Vicetone_ Cozi Zuehlsdorff.mp3'
        },
        {
            name: 'Spectre',
            singer: 'Alan Walker',
            image: 'img/SpectreSpectre.jpg',
            path : 'img/Spectre-Alan-Walker.mp3'
        },
        {
            name: 'Save Me',
            singer: 'DEAMN',
            image: 'img/Save_me.jpg',
            path : 'img/Save-Me-DEAMN.mp3'
        },
        {
            name: 'Play',
            singer: 'K-391 & Alan Walker',
            image: 'img/Play.jpg',
            path : 'img/Play - K-391_Alan Walker_Martin Tungevaa.mp3'
        },
        {
            name: 'On My Way',
            singer: 'Alan Walker & Sabrina',
            image: 'img/On_May_Way.jpg',
            path : 'img/On My Way - Alan Walker_ Sabrina Carpent.mp3'
        },
        {
            name: 'Lily',
            singer: 'Alan Walker & K-391 & Emelie',
            image: 'img/Lily.jpg',
            path : 'img/Lily - Alan Walker_ K-391_ Emelie Hollow.mp3'
        },
        {
            name: 'Faded',
            singer: 'Alan Walker & Iselin Solheim',
            image: 'img/Faded.jpg',
            path : 'img/Faded - Alan Walker_ Iselin Solheim.mp3'
        },
        {
            name: 'End of Time',
            singer: 'K-39 & Alan-Walker & Ahrix',
            image: 'img/End Of Time.jpg',
            path : 'img/End-of-Time-K-391-Alan-Walker-Ahrix.mp3'
        },
        {
            name: 'Don\'t You Hold Me Down',
            singer: 'Alan Walker',
            image: 'img/Dont You Hold Me Down (Single).jpg',
            path : 'img/Don_t You Hold Me Down - Alan Walker_ Ge.mp3'
        },
    
        {
            name: 'Darkside',
            singer: 'Alan Walker & Tomine Harket',
            image: 'img/Darkside.jpg',
            path : 'img/Darkside - Alan Walker_ Tomine Harket_ A.mp3'
        },
    
        {
            name: 'Dap Vo Tim Anh Cho Roi Remix',
            singer: 'Trong Hieu',
            image: 'img/Dap-Vo-Tim-Anh-Cho-Roi-Remix-Version-Trong-Hieu.mp3.jpg',
            path : 'img/Dap-Vo-Tim-Anh-Cho-Roi-Remix-Version-Trong-Hieu.mp3'
        } 
    
    ],
    setConfig : function (key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
       const htmls = this.songs.map((song,index) => {
           return `
            <div class="song ${index===this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
           `
       })
       playlist.innerHTML = htmls.join('')
    },
    defineProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                 return this.songs[this.currentIndex]
            }
            })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý cd quay/dừng
       const cdThumbAnimate =  cdThumb.animate([
            {transform: 'rotate(0deg)'},
            {transform: 'rotate(0deg) scale(0.5,0.5) rotate(-360deg)'},
            {transform: 'rotate(0deg) scale(1.2,1.2) rotate(720deg)'},
            {transform: 'rotate(0deg) scale(0.5,0.5) rotate(360deg)'},
            {transform: 'rotate(360deg) scale(1.2,1.2) rotate(180deg)'},
            {transform: 'skew(0deg,0deg)'},
            { transform: 'skew(360deg,360deg)'},
        ], {
            duration: 18000, //10 s
            iterations : Infinity,
            delay : 1000
        })
            cdThumbAnimate.pause()

        //Xử lí phóng to cd 
        document.onscroll = function(){
            const scrollTop = window.scrollY ||document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
            }

        //Xử lí khi click button play
        playBtn.onclick = function(){
            if (_this.isPlaying){
                audio.pause()
            } else{
                audio.play()
            }
        }
        //Khi song được chay
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            h2.classList.add('animationH2')
            h4.innerText = "Now playing:" 
            cdThumbAnimate.play()     
            }
         //Khi song dừng
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            h2.classList.remove('animationH2')
            h4.innerText = "Please press the PLAY button to enjoy good music" 
            cdThumbAnimate.pause()  
            }
        //Khi thay đổi tiến độ bài hat
        audio.ontimeupdate = function (){
            if (audio.duration){
                const progressPer = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = progressPer
            }
            }
        // Xử lý khi tua
        progress.onchange = function (e){
            const seekTime = e.target.value/100*audio.duration
            audio.currentTime = seekTime
        }
        // Khi next bai song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi prev bai song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Random bai hat
        randomtBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomtBtn.classList.toggle('active',_this.isRandom)
        }

        //Xử lí next song khi end 
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        // Xử lí lặp lại
        repeatBtn.onclick = function (e) {
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat',_this.isRepeat)
          repeatBtn.classList.toggle('active', _this.isRepeat) 
        }

        //Lắng nghe click vào playlist
        playlist.onclick = function (e){
            const songNode = e.target.closest('.song:not(.active)')
            const songOpt =  e.target.closest('.option')
            //Xử lí khi click vào song
         if (songNode||songOpt) {
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    console.log(songNode.dataset.index)
                }
                //Xử lí khi kích vào option
                if(e.target.closest('.option')){

                }
            }
           
        }
        
    },
    scrollToActiveSong : function(){
        if (this.currentIndex <= 3){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block : 'center',
                });
            },200) 
        }else{
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block : 'nearest',
                });
            },200)   
        }
    },

    loadCurrentSong : function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
        // console.log(heading,cdThumb,audio)
    },
    loadConfig : function (){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        
    },
    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong : function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong : function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    loadUIconfig : function(){
        randomtBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat) 
    },


    start : function (){

        //Load cấu hình từ config vào app
        this.loadConfig()

        //Load UI config khi refesh trang
        this.loadUIconfig()

        //Định nghĩa các thuộc tính 
        this.defineProperties()

        //Lắng nghe xử lí điều kiện
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()



    }

}

app.start()