const func = require('./http'),
      fs = require('fs'),
      http = require('http')

require('colors')

if (!fsExistsSync('meizi')) fs.mkdirSync('meizi',err=> console.error(err))

function meizi(data) {
  if (data.msg == `话题不存在` || data.post.title == `/* 话题已删除 */`) return

  if (data.post.user.gender == 1 && data.post.category.categoryID == 3) {
    let id = data.post.postID,
        str = `meizi/${id}`
    if (!fsExistsSync(str)) {
      fs.mkdirSync(str,err=> console.log(err))
    }

    // create .json file
    let file = fs.createWriteStream(`meizi/${id}/${id}.json`)
    file.write(JSON.stringify(data))
    console.log(`   - ${id}.json 创建成功`.bgBlue.black)

    // get create .jpg image
    let imgs = data.post.images || []
    if (imgs.length >= 1) {
      let str = `meizi/${id}/images`
      if (!fsExistsSync(str)){
        fs.mkdirSync(str,err=> console.log(err))
      } 
      imgs.forEach((item,index)=> {
        let path = `meizi/${id}/images/${data.post.user.nick}-${index}.jpg`
        let file = fs.createWriteStream(path)
        http.get(`${item}`,req=> req.pipe(file))
        console.log(`     - ${path} 成功`.bgCyan.black)
      })
      console.log(`   图片创建成功,创建了${imgs.length}张`.red)
    }
   
    // add readme.md file
    {
      let year = e=> (new Date()).getFullYear() - post.user.age
      let post = data.post,
      y = year(),
      readmeTxt = `
        # ${post.title}

        ${post.detail}

        ## 帖子详情

        热度: ${post.hit}

        评论: ${post.commentCount}

        创建时间: ${post.createTime}

        ## 妹子信息

        <p align="center">
          <img src="${post.user.avatar}">
        </p>

        妹子id: ${post.user.userID}

        妹子昵称: ${post.user.nick}

        妹子芳龄: ${post.user.age} (${y})

      `
      let readme = fs.writeFile(`meizi/${id}/${data.post.user.nick}.md`,readmeTxt,'utf8',err=> {
        if (err) {
          console.log(err)
          return 
        }
        console.log('   成功创建   '.bgRed.white)
      })
    }
  }
}

function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

let index = 1
let event = setInterval(()=> {
  console.log(' ')
  console.log(` > 执行第${index}次任务`.rainbow)
  index++
  if (index >= 1000) {
    clearInterval(event)
  }
  func.get({
    url: `${func.floor}/post/detail/ANDROID/2.3`,
    data: {
      post_id: index
    },
    success: data=> meizi(data)
  })
},3000)
  
