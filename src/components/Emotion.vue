<template>
  <div class="Emotion">
    <div class="title">情绪识别</div>
    <form id="uploadForm" method="post" enctype="multipart/form-data">

            <div class="img-container" id='pic_c'>
                <div class="img-i" :class="{checked:item.checked}" @click="showData(item)" v-for="(item,index) in dataList" :key='index' :style="getStyle(item)"></div>
                <img id="pic" :src="src" alt="">
            </div>
            <div class="inputarea">
              <div class="file-btn">
                上传图片
              </div>
            <input type="file" class="file-input" id='myfile' name="image" size="50" @change="upload"/>
            </div>
            <br />
            </form>
            <div class="data result" :style="{'height':height,'opacity':opacity}" @click="height=0;opacity=0">
              
              <div><label>愤怒</label><span>{{selectData.anger|format}}</span></div>
              <div><label>蔑视</label><span>{{selectData.contempt|format}}</span></div>
              <div><label>厌恶</label><span>{{selectData.disgust|format}}</span></div>
              <div><label>害怕</label><span>{{selectData.fear|format}}</span></div>
              <div><label>高兴</label><span>{{selectData.happiness|format}}</span></div>
              <div><label>中立</label><span>{{selectData.neutral|format}}</span></div>
              <div><label>悲伤</label><span>{{selectData.sadness|format}}</span></div>
              <div><label>惊喜</label><span>{{selectData.surprise|format}}</span></div>
            </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Emotion',
  data () {
    return {
      msg: '',
      src:'',
      dataList:[],
      height:0,
      opacity:0,
      selectData:{
        "anger":9.74489E-07,
        "contempt":0.000520375,
        "disgust":6.301646E-07,
        "fear":1.15360066E-09,
        "happiness":0.0007754718,
        "neutral":0.9985856,
        "sadness":0.000116374082,
        "surprise":5.90946968E-07
      }
    }
  },
  filters:{
        format(val){
          val = val||0;
          let result  = parseInt(val*100);
          return val.toFixed(4)
        }
      },
  methods:{
    getEmotiontest(){
      let url = 'http://duandan.top:8081/file/1512447829673_WechatIMG103.jpeg'
      
    },
         upload() {
      var file = document.getElementById('myfile').files;
			var fs = new FileReader();
			if(/image/.test(file[0].type)){//操作图像
				fs.readAsDataURL(file[0]);
				var type='image';
				fs.onload = ()=>{
					 this.picCompress(fs.result,1000,(imgData)=>{
              this.src = imgData;
              this.uploadFile(imgData)
            });	
				}	
			}
    },
    uploadFile(data){
        console.log(data)
        axios.post('https://duandan.top/em/file_upload_base64', {data:data})
          .then((res) => {
            console.log(res);
            let src = 'https://duandan.top/em' + res.data.filename
            this.getEmotion(src)
          })
          .catch(function(error) {
            console.log(error);
          });
    },
      getStyle(item){
        let pic = document.getElementById('pic')
        let nw = pic.naturalWidth;
        let nh = pic.naturalHeight;

        let w = pic.width;
        let h = pic.height;
        let bl = w/nw;
        let data = item.faceRectangle;

        let cw = document.getElementById('pic_c').clientWidth;
        let py = (cw-w)/2

        let ch = document.getElementById('pic_c').clientHeight;
        let ph = (ch-h)/2
        return {
          left:(data.left*bl+py)+'px',
          top:(data.top*bl+ph)+'px',
          width:data.width*bl+'px',
          height:data.height*bl+'px'
        }
      },
      
      showData(item){
        console.log(0);
          this.selectData = item.scores
          this.dataList.forEach(item=>{
              this.$set(item,'checked',false);
          })
          item.checked = true;
          this.height = '75vw';
          this.opacity = '1';
      },
      getEmotion(url){
        var instance = axios.create({
          headers: {
            "Content-Type":"application/json",
            "Ocp-Apim-Subscription-Key":"13fd0c026d2343ef9f682303098513c2"
          }
        });
        let sendData = {url};
        instance.post('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?', sendData)
        .then( (res)=> {
          console.log(res.data);
          this.dataList = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      },picCompress(data, w,callback) {
      var newImg = new Image()
      newImg.src = data;
      var imgWidth, imgHeight, offsetX = 0,
        offsetY = 0;
      newImg.onload = function() {
        var img = document.createElement("img");
        img.src = newImg.src;
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;

        if (imgHeight > w || imgWidth > w) {
          if (imgWidth > imgHeight) {
            imgWidth = w * imgWidth / imgHeight;
            imgHeight = w;
          } else {
            imgHeight = w * imgHeight / imgWidth;
            imgWidth = w;
          }
          var canvas = document.createElement("canvas");
          canvas.width = imgWidth;
          canvas.height = imgHeight;
          var ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, imgWidth, imgHeight);
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
          var result = canvas.toDataURL("image/jpeg", 0.7);
          callback(result)
        } else {
           callback(data);
        }


      }
    }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.result{
  padding: 6vw 5vw 6vw;
  width: 100%;
  height: 75vw;
  position: fixed;
  background: rgba(0,0,0,.5);
  color: #fff;
  border-radius: 4vw;
  bottom: 0;
  left: 0;
  text-align: left;
  box-sizing:border-box;
  overflow: hidden;
  transition: all .3s;
}
.result span{
  float: right;
  
}
.result div{
  margin-top: 1vw;
  padding:.1em;
  font-size: 1.25em;
}
.title{
  font-size: 8vw;
  text-align: center;
  margin-bottom: 3vw;
}
.img-container{
  width: 90vw;
  height: 90vw;
  max-width: 600px;
  max-height: 600px;
  display: flex;
  justify-content: center;
  align-items:center;

  vertical-align: middle;
  margin: 0 auto;
  position: relative;
}
.img-container::before{
  content: '';
  position: absolute;
  left: -50%;
  top: -50%;
  width: 200%;
  border: 1px solid #ddd;
  height: 200%;
  transform: scale(.5,.5)
}
.img-container img{
  max-width: 90vw;
  max-height: 90vw;
  line-height: 90vw;
  vertical-align: middle;
}
.img-i{
  position: absolute;
  border: 2px solid #3364f2;
}
.img-i.checked{
  background: #3394f2;
  opacity: 0.3;
}
.inputarea{
  width: 90vw;
  height: 10vw;
  max-width: 600px;
  max-height: 70px;
  text-align: center;
  margin: 4vh auto;
  position: relative;
  background: #3394f2;
  color: #fff;
  border-radius: 1vw;
}
.file-btn{
  position: absolute;
  left: 0;
  width: 0;
  display: block;
  width: 100%;
  height: 100%;
  z-index: 9;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items:center;
}
.file-input{
  position: absolute;
  left: 0;
  width: 0;
  border: 1px solid #ddd;
  display: block;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
}
</style>
