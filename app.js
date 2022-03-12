const introduction = document.querySelector('.intro');
const preIntro = document.querySelector('.pre-intro');
const btnStart = document.getElementById('btn-start');
const audio = new Audio('./audio/intro-sound.wav');
const gaming = document.querySelector('.main-game');

// --- Warrior Side: --- \\
const warriorSide = document.querySelector('.warrior-side');
const warriorInfoHealthPoints = document.getElementById(
  'warrior-health-points'
);
const warriorInfoAttackPoints = document.getElementById(
  'warrior-attack-points'
);
const warriorInfoDefencePoints = document.getElementById(
  'warrior-defence-points'
);
const warriorInfoNumOfAttacks = document.getElementById(
  'warrior-attacks-number'
);
const warriorInfoTotalDamage = document.getElementById('warrior-damage');
const warriorInfoHealPerRound = document.getElementById('warrior-healing');

// --- Monster Side: --- \\
const monsterSide = document.querySelector('.monster-side');
const monsterInfoHealthPoints = document.getElementById(
  'monster-health-points'
);
const monsterInfoAttackPoints = document.getElementById(
  'monster-attack-points'
);
const monsterInfoDefencePoints = document.getElementById(
  'monster-defence-points'
);
const monsterInfoNumOfAttacks = document.getElementById(
  'monster-attacks-number'
);
const monsterInfoTotalDamage = document.getElementById('monster-damage');
const monsterInfoHealPerRound = document.getElementById('monster-healing');

// --- Shared Side: --- \\
const warriorLifeProgress = document.getElementById('warrior-life');
const monsterLifeProgress = document.getElementById('monster-life');
const standardAttackBtn = document.getElementById('attack');
const standardDefenceBtn = document.getElementById('defence');
const specialSlayBtn = document.getElementById('slay');
const specialShieldBtn = document.getElementById('shield');
const specialHealBtn = document.getElementById('heal');

// --- Bottom Side: --- \\
const h1AnnounceWinner = document.querySelector('.announceWinner');
const btnStartGame = document.querySelector('.startGame');

// --- Functions: --- \\
function rotateScreenOnHit() {
  gaming.classList.add('rotate-screen');
}

function calcHit(attackerAttack, attackedDefence) {
  const AttackerNum = Math.round(Math.random() * 100);
  const attackedNum = Math.round(Math.random() * 100);
  if (attackerAttack + AttackerNum >= attackedDefence + attackedNum) {
    console.log(attackerAttack, AttackerNum, attackedDefence, attackedNum);
    rotateScreenOnHit();
    return true;
  }
  return false;
}

function calcDamage(weaponMaxDamage, weaponMinDamage, damageAddition) {
  return Math.round(
    Math.random() * (weaponMaxDamage - weaponMinDamage) +
      weaponMinDamage +
      damageAddition
  );
}

// --- Code: --- \\

introduction.style.display = 'none';
gaming.style.display = 'none';

btnStart.addEventListener('click', () => {
  preIntro.style.display = 'none';
  introduction.style.display = 'flex';
  audio.play();
  setTimeout(() => {
    introduction.style.display = 'none';
    gaming.style.display = 'flex';
    btnStartGame.style.display = 'flex';
  }, 7000);
});

class Fighter {
  maxLife = 100;
  maxAttack = 30;
  maxDefence = 50;
  maxDamage = 10;
  minDamage = 1;
  damage = 10;
  healing = 1;
  numAttacks = 1;

  constructor() {
    this.life = this.maxLife;
    this.attack = this.maxAttack;
    this.defence = this.maxDefence;
  }
  setLife(damageHP) {
    this.life -= damageHP;
    if (this.life < 0) {
      this.life = 0;
    }
    this.setChars();
  }
  setChars() {
    let sum = this.calcDamage2Chars();
    sum /= 100;
    this.attack = Math.ceil(this.maxAttack * sum);
    this.defence = Math.ceil(this.maxDefence * sum);
    this.damage = Math.ceil(this.maxDamage * sum);
  }
  calcDamage2Chars() {
    return Math.round((this.maxLife * this.life) / 100);
  }
  regenerate() {
    if (this.life + this.healing < this.maxLife && this.life > 0) {
      this.life += this.healing;
    } else if (this.life + this.healing > this.maxLife && this.life > 0) {
      this.life = this.maxLife;
    }
    this.setChars();
  }
}

class Warrior extends Fighter {
  constructor() {
    super();
    this.attackSound = 'audio/WARRIOR ATTACK 1.mp3';
    this.defenceSound = 'audio/WARRIOR USES STANDARD SHIELD.mp3';
    this.slaySound = 'audio/WARRIOR ATTACK 3.mp3';
    this.healSound = 'audio/WARRIOR USE POWER.mp3';
    this.shieldSound = 'audio/WARRIOR ATTACK 2.mp3';
    this.gotHitSound = 'audio/WARRIOR INJURED 1.mp3';
    this.dyingSound = 'audio/WARRIOR DIES.mp3';
  }
  standardAttack() {
    const sound = new Audio(this.attackSound);
    sound.play();
    return calcDamage(this.maxDamage, this.minDamage, this.damage);
  }
  standardDefence() {
    const sound = new Audio(this.defenceSound);
    sound.play();
    return 20;
  }
  slay() {
    const sound = new Audio(this.slaySound);
    sound.play();
    return Math.round(this.maxLife / 2);
  }
  holyShield() {
    const sound = new Audio(this.shieldSound);
    sound.play();
    return this.maxDefence;
  }
  holyHealing() {
    const sound = new Audio(this.healSound);
    sound.play();
    const hh = Math.round(this.maxLife / 2);
    return hh;
  }
  gotHit() {
    const sound = new Audio(this.gotHitSound);
    sound.play();
  }
  gotDead() {
    const sound = new Audio(this.dyingSound);
    sound.play();
  }
}

class Monster extends Fighter {
  constructor() {
    super();
    this.attackSound = 'audio/MONSTER ATTACK 1.mp3';
    this.gotHitSound = 'audio/MONSTER GOT INJURED.mp3';
    this.dyingSound = 'audio/MONSTER DIES.mp3';
  }
  standardAttack() {
    const sound = new Audio(this.attackSound);
    sound.play();
    return calcDamage(this.maxDamage, this.minDamage, this.damage);
  }
  gotHit() {
    const sound = new Audio(this.gotHitSound);
    sound.play();
  }
  gotDead() {
    const sound = new Audio(this.dyingSound);
    sound.play();
  }
}

class Game {
  warriorSlayUsed = false;
  warriorShieldUsed = false;
  warriorHealUsed = false;
  constructor() {
    this.warrior = new Warrior();
    this.monster = new Monster();
  }
  turnOffButton(el) {
    el.setAttribute('disabled', '');
    el.classList.remove('hover-me');
    el.classList.add('dead-button');
  }
  turnOnButton(el) {
    el.disabled = false;
    el.classList.remove('dead-button');
    el.classList.add('hover-me');
  }
  turnOffStandardButtons() {
    this.turnOffButton(standardAttackBtn);
    this.turnOffButton(standardDefenceBtn);
  }
  turnOnStandardButtons() {
    this.turnOnButton(standardAttackBtn);
    this.turnOnButton(standardDefenceBtn);
  }
  turnOffSpecialButtons() {
    this.turnOffButton(specialSlayBtn);
    this.turnOffButton(specialShieldBtn);
    this.turnOffButton(specialHealBtn);
  }
  turnOnSpecialButtons() {
    if (this.warriorSlayUsed === false) {
      this.turnOnButton(specialSlayBtn);
    }
    if (this.warriorShieldUsed === false) {
      this.turnOnButton(specialShieldBtn);
    }
    if (this.warriorHealUsed === false) {
      this.turnOnButton(specialHealBtn);
    }
  }
  warriorAttack() {
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    const damage = this.warrior.standardAttack();
    setTimeout(() => {
      if (calcHit(this.warrior.attack, this.monster.defence)) {
        this.monster.setLife(damage);
        this.renderMonsterScreen();
        if (this.monster.life > 0) {
          this.monster.gotHit();
        } else {
          this.monster.gotDead();
        }
      }
    }, 600);
    this.warrior.regenerate();
    this.renderWarriorScreen();
    setTimeout(() => {
      this.monsterAttack();
    }, 1000);
  }
  warriorDefence() {
    this.warrior.regenerate();
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    const def = this.warrior.standardDefence();
    this.warrior.defence += def;
    this.renderWarriorScreen();
    setTimeout(() => {
      this.monsterAttack();
      setTimeout(() => {
        this.warrior.defence -= def;
        this.renderWarriorScreen();
      }, 1000);
    }, 1000);
  }
  warriorSlay() {
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    this.warriorSlayUsed = true;
    const damage = this.warrior.slay();
    setTimeout(() => {
      this.monster.setLife(damage);
      rotateScreenOnHit();
      this.renderMonsterScreen();
      if (this.monster.life > 0) {
        this.monster.gotHit();
      } else {
        this.monster.gotDead();
        this.gameOver();
        return;
      }
    }, 600);
    this.warrior.regenerate();
    this.renderWarriorScreen();
    setTimeout(() => {
      this.monsterAttack();
    }, 1000);
  }
  warriorShield() {
    this.warriorShieldUsed = true;
    this.warrior.regenerate();
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    const def = this.warrior.holyShield();
    this.warrior.defence += def;
    this.renderWarriorScreen();
    setTimeout(() => {
      this.monsterAttack();
      setTimeout(() => {
        this.warrior.defence -= def;
        this.renderWarriorScreen();
      }, 1000);
    }, 1000);
  }
  warriorHealing() {
    this.warriorHealUsed = true;
    this.warrior.regenerate();
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    const def = this.warrior.holyHealing();
    this.warrior.life += def;
    if (this.warrior.life > this.warrior.maxLife) {
      this.warrior.life = this.warrior.maxLife;
    }
    this.renderWarriorScreen();
    setTimeout(() => {
      this.monsterAttack();
    }, 1000);
  }
  monsterAttack() {
    gaming.classList.remove('rotate-screen');
    if (this.monster.life > 0) {
      const damage = this.monster.standardAttack();
      setTimeout(() => {
        if (calcHit(this.monster.attack, this.warrior.defence)) {
          this.warrior.setLife(damage);
          this.renderWarriorScreen();
          if (this.warrior.life > 0) {
            this.warrior.gotHit();
          } else {
            this.warrior.gotDead();
          }
        }
        this.monster.regenerate();
        this.renderMonsterScreen();
        this.turnOnStandardButtons();
        this.turnOnSpecialButtons();
      }, 1000);
    } else {
      this.gameOver('WARRIOR');
    }
  }

  renderMonsterScreen() {
    if (this.monster.life === 0) {
      monsterSide.classList.add('blackAndWhite');
    }
    monsterInfoHealthPoints.textContent = `Health: ${this.monster.life}`;
    monsterInfoAttackPoints.textContent = `Attack: ${this.monster.attack}`;
    monsterInfoDefencePoints.textContent = `Defence: ${this.monster.defence}`;
    monsterInfoNumOfAttacks.textContent = `Attacks: ${this.monster.numAttacks}/Per Round`;
    monsterInfoTotalDamage.textContent = `Damage: ${
      this.monster.minDamage + this.monster.damage
    } - ${this.monster.maxDamage + this.monster.damage}`;
    monsterInfoHealPerRound.textContent = `Regeneration: ${this.monster.healing}/Per Round`;
    monsterLifeProgress.value = this.monster.life;
  }
  renderWarriorScreen() {
    if (this.warrior.life === 0) {
      warriorSide.classList.add('blackAndWhite');
    }
    warriorInfoHealthPoints.textContent = `Health: ${this.warrior.life}`;
    warriorInfoAttackPoints.textContent = `Attack: ${this.warrior.attack}`;
    warriorInfoDefencePoints.textContent = `Defence: ${this.warrior.defence}`;
    warriorInfoNumOfAttacks.textContent = `Attacks: ${this.warrior.numAttacks}/Per Round`;
    warriorInfoTotalDamage.textContent = `Damage: ${
      this.warrior.minDamage + this.warrior.damage
    } - ${this.warrior.maxDamage + this.warrior.damage}`;
    warriorInfoHealPerRound.textContent = `Regeneration: ${this.warrior.healing}/Per Round`;
    warriorLifeProgress.value = this.warrior.life;
  }

  gameOver(fighter) {
    this.turnOffStandardButtons();
    this.turnOffSpecialButtons();
    h1AnnounceWinner.textContent = `${fighter} WINS`;
    h1AnnounceWinner.classList.remove('visibleHide');
  }
  startGame() {
    this.warrior = new Warrior();
    this.monster = new Monster();
    monsterSide.classList.remove('blackAndWhite');
    warriorSide.classList.remove('blackAndWhite');
    this.warriorSlayUsed = false;
    this.warriorShieldUsed = false;
    this.warriorHealUsed = false;
    this.renderMonsterScreen();
    this.renderWarriorScreen();
    this.turnOnStandardButtons();
    this.turnOnSpecialButtons();
  }
}

const game = new Game();
game.renderMonsterScreen();
game.renderWarriorScreen();

standardAttackBtn.addEventListener('click', () => {
  game.warriorAttack();
});
standardDefenceBtn.addEventListener('click', () => {
  game.warriorDefence();
});
specialSlayBtn.addEventListener('click', () => {
  game.warriorSlay();
});
specialShieldBtn.addEventListener('click', () => {
  game.warriorShield();
});
specialHealBtn.addEventListener('click', () => {
  game.warriorHealing();
});
btnStartGame.addEventListener('click', () => {
  game.startGame();
});
h1AnnounceWinner.addEventListener('click', () => {
  h1AnnounceWinner.classList.add('visibleHide');
});
