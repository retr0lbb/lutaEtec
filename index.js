


   //canvas
    const canvas = document.querySelector('canvas')
    const c = canvas.getContext('2d')
    
    canvas.width = 1024
    canvas.height = 576
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 1.4
class Sprite{
    constructor({position, velocity, speed, jumpForce,color = 'white', offset, hp}){

        this.position = position
        this.velocity = velocity
        this.width = 50
        this.speed = speed
        this.jumpForce = jumpForce
        this.height = 150
        this.lastKey
        this.hp = hp
        this.color = color
        this.attackBox = {
            position:{
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.isAttacking
        this.isGrounded
        this.facingRight
        
    }
   
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width ,this.height)
        //Check box
        if(this.isAttacking){
        c.fillStyle = 'green' 
        c.fillRect(this.attackBox.position.x, 
                   this.attackBox.position.y, 
                   this.attackBox.width, 
                   this.attackBox.height)
                }
    }
    update(){
        this.colidir()
        this.draw()
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y =0
            this.isGrounded= true
        }else this.velocity.y += gravity, this.isGrounded = false
    }
    attack(){
        this.isAttacking =true
        setTimeout(() =>{
            this.isAttacking =false
        },200)
        console.log("attack")
    }
    colidir(){
        if(this.position.x + this.width>=canvas.width){
            this.velocity.x +=-5
        }else if(this.position.x <= canvas.width - canvas.width){
            this.velocity.x += 5
        }
    }
    jump(){
        if(this.isGrounded == true){
            this.velocity.y = -this.jumpForce
        }
    }
    flip(){
        if(this.facingRight == false){
            this.attackBox.offset.x = -50 -this.width
        }else{
            this.attackBox.offset.x = 50
        }
    }
}
//OBJPlayer
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity:{
        x:0,
        y:10
    },
    speed:5,
    jumpForce:20,
    color: 'blue',
   offset:{
    x:100,
    y:0
   },
   hp: 100,
   facingRight: true
})
//OBJENEmy
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity:{
        x:0,
        y:1
    },
    speed: 5,
    jumpForce: 30,
    color: 'red',
    offset:{
        x:100,
        y:0
       },
       hp:100,
       facingRight : false
})
enemy.draw()
player.draw()
const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    
}
function rectangularCollision({rectangle1,rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width>= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x +rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y&&
        rectangle1.attackBox.position.y<= rectangle2.position.y + rectangle2.height

    )
}
function PlayersCollision({p1,p2}){

    return(
        p1.position.x + p1.width >= p2.position.x &&
        p1.position.x <= p2.position.x + p2.width&&
        p1.position.y + p1.height >= p2.position.y&&
        p1.position.y <= p2.position.y + p2.height
    )
}
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.flip()
    enemy.flip()
    
 

    console.log("player esta virado para direta do inimigo",player.facingRight)
    console.log("player esta virado para esquerda do inimigo",enemy.facingRight)

    //player side
    if(player.position.x + player.width/2 < enemy.position.x + enemy.width/2){
        player.facingRight = true
    }else{
        player.facingRight = false
        
    }
    //enemy side
    if(enemy.position.x + enemy.width/2 < player.position.x + player.width/2){
        enemy.facingRight = true
    }else{
        enemy.facingRight = false
       
    }

    //player move
    player.velocity.x =0
    if(keys.a.pressed == true && player.lastKey ==='a'){
        player.velocity.x = -player.speed
    }else if (keys.d.pressed == true && player.lastKey==='d'){
        player.velocity.x = player.speed
    }
    
    //enemy move 
    enemy.velocity.x = 0
    if(keys.ArrowRight.pressed == true && enemy.lastKey ==='ArrowRight'){
        enemy.velocity.x = enemy.speed
    }else if (keys.ArrowLeft.pressed == true && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x = -enemy.speed
    }

    //hit check
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })&& player.isAttacking){
        player.isAttacking = false
        enemy.hp+= -10
        console.log("hit p")
        document.querySelector('#enemyHealth').style.width = enemy.hp + '%'
    }
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })&& enemy.isAttacking){
        enemy.isAttacking = false
        player.hp += -10
        document.querySelector('#playerHealth').style.width = player.hp + '%'
    }

    if(PlayersCollision({
        p1:player,
        p2:enemy
    })){
        if((player.position.x+(player.width/2))<(enemy.position.x +(enemy.width/2))){
            player.velocity.x =-1
        }else if((player.position.x+(player.width/2)) > (enemy.position.x +(enemy.width/2))){
            player.velocity.x = 1 
        }
    }
    if(PlayersCollision({
        p1:enemy,
        p2:player
    })){
        if((enemy.position.x+(enemy.width/2))<(player.position.x +(player.width/2))){
            enemy.velocity.x =-1
        }else if((enemy.position.x+(enemy.width/2)) > (player.position.x +(player.width/2))){
            enemy.velocity.x = 1 
        }
    }
}
animate()
window.addEventListener('keydown', (event) => {
    //player KeyDown
   switch(event.key){
    case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
    break
    case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
    break
    case 'w':
       player.jump()
    break
    case "f":
    player.attack()
    break

//enemy keydown
    case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
    case 'ArrowUp':
       enemy.jump()
        break
    case 'ç':
        enemy.attack()
        break
   }

})
window.addEventListener('keyup', (event) => {
    switch(event.key){
     case 'd':
         keys.d.pressed = false
     break
     case 'a':
        keys.a.pressed = false
     break
     
//enemy keyup
    case 'ArrowRight':
        keys.ArrowRight.pressed = false
        lastKey = 'ArrowRight'
        break
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        lastKey = 'ArrowLeft'
        break
 
    }
 })
//ganhei do guilherme dia 25/10/2022 as 15:33 no laboratorio 1 com o fabio dando aula
//fazer sprites fazer ui
