const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const scoreEl = document.querySelector("#scoreEl");
const startGameEl = document.querySelector("#startGameEl");
const modalEl = document.querySelector("#modalEl");
const modalScoreEl = document.querySelector("#modalScoreEl");
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velacity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velacity = velacity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velacity.x;
    this.y = this.y + this.velacity.y;
  }
}

class Enemi {
  constructor(x, y, radius, color, velacity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velacity = velacity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velacity.x;
    this.y = this.y + this.velacity.y;
  }
}
const frication = 0.99;
class Particle {
  constructor(x, y, radius, color, velacity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velacity = velacity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velacity.x *= frication;
    this.velacity.y *= frication;
    this.x = this.x + this.velacity.x;
    this.y = this.y + this.velacity.y;
    this.alpha -= 0.01;
  }
}

const xPlayer = canvas.width / 2;
const yPlayer = canvas.height / 2;
let player = new Player(xPlayer, yPlayer, 10, "white");
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(xPlayer, yPlayer, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = 0;
}
let intervalId;
function spawnEnemies() {
  if (!intervalId)
    intervalId = setInterval(() => {
      const radius = Math.random() * (30 - 5) + 5;
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      let x;
      let y;
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }
      const angel = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
      const velocity = {
        x: Math.cos(angel),
        y: Math.sin(angel),
      };
      const enemi = new Enemi(x, y, radius, color, velocity);
      enemies.push(enemi);
    }, 1000);
}

let animatedId;
let score = 0;
function animate() {
  animatedId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemi, index) => {
    enemi.update();
    const dist = Math.hypot(enemi.x - player.x, enemi.y - player.y);
    if (dist - enemi.radius - player.radius < 0) {
      console.log("end game");
      cancelAnimationFrame(animatedId);
      modalEl.style.display = "flex";
      modalScoreEl.innerHTML = score;
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemi.x, projectile.y - enemi.y);
      // hit the enemy
      if (dist - enemi.radius - projectile.radius < -2) {
        if (enemi.radius - 10 > 10) {
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
            gsap.to(enemi, {
              radius: enemi.radius - 10,
            });
          }, 0);
          score += 1;
        } else {
          score += 2;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
            enemies.splice(index, 1);
          }, 0);
        }
        scoreEl.innerHTML = score;
        for (let i = 0; i < enemi.radius * 2; i++) {
          const particle = new Particle(
            projectile.x,
            projectile.y,
            Math.random() * 2,
            enemi.color,
            {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            }
          );
          particles.push(particle);
        }
      }
    });
  });
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}

addEventListener("click", (e) => {
  const angel = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angel) * 5,
    y: Math.sin(angel) * 5,
  };
  const projectile = new Projectile(
    canvas.width / 2,
    canvas.height / 2,
    5,
    "white",
    velocity
  );
  projectiles.push(projectile);
});
startGameEl.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
