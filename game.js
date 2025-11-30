// game.js
class RPGGame {
  constructor() {
    this.characters = [
      {
        name: "谭启林",
        hp: 70,
        maxHp: 70,
        skills: [
          { 
            name: "拉雷", 
            damage: { type: "法术", amount: 5 }, 
            effects: [{ type: "晕眩" }], 
            cd: 2, 
            occupied: false,
            description: "5法伤+晕眩，2 CD"
          },
          { 
            name: "掏一个", 
            damage: { type: "物理", amount: 16 }, 
            occupied: true,
            description: "16物伤"
          },
          { 
            name: "拔吊毛", 
            effects: [{ type: "必中" }, { type: "增伤", amount: 150 }],
            cd: 2, 
            occupied: false,
            description: "下次攻击必中+150%伤，2 CD"
          }
        ]
      },
      {
        name: "肯追克拉马尔",
        hp: 80,
        maxHp: 80,
        skills: [
          { 
            name: "RAP star", 
            effects: [{ type: "自损", amount: 15 }, { type: "额外回合" }],
            occupied: false,
            description: "自损15，得1额外回合"
          },
          { 
            name: "靠你娘", 
            damage: { type: "物理", amount: 15 }, 
            effects: [{ type: "被靠标记" }],
            occupied: true,
            description: "15物伤+给目标技能1被靠标记"
          },
          { 
            name: "何意味/何异味", 
            effects: [
              { type: "限定技" },
              { type: "条件", condition: "HP<60" },
              { type: "改造", target: "一技能", changes: [{ type: "自损", amount: 5 }] },
              { type: "治疗", amount: 20 }
            ],
            occupied: false,
            limited: true,
            description: "限定技，HP<60时可用，自损5改一技能自损5；回20"
          }
        ]
      },
      {
        name: "曹博睿",
        hp: 100,
        maxHp: 100,
        skills: [
          { 
            name: "三高人群", 
            effects: [
              { type: "被动" },
              { type: "反弹", damageType: "法术", amount: 50 },
              { type: "抵抗控制", chance: 50 },
              { type: "增伤", damageType: "物理", amount: 5, nextOnly: true }
            ],
            description: "被动：法伤+7反弹一半；50%抵抗控制；物伤+5且自身下次伤害+7"
          },
          { 
            name: "装b", 
            damage: { type: "法术", amount: 13 }, 
            effects: [{ type: "治疗", amount: 10 }, { type: "增伤", target: "对手", amount: 5, nextOnly: true }],
            occupied: true,
            description: "13法伤+自回10+对面下次对自身伤害+5"
          },
          { 
            name: "软硬不吃", 
            effects: [
              { type: "持续回合", amount: 6 },
              { type: "伤害限制", threshold: 15, cappedAmount: 15 }
            ],
            occupied: true,
            description: "持续6回合，>15伤变15，≤15伤取消附加后果"
          }
        ]
      },
      {
        name: "杜找羊",
        hp: 110,
        maxHp: 110,
        skills: [
          { 
            name: "传播HIV", 
            effects: [
              { type: "被动" },
              { type: "免疫" },
              { type: "反伤", damageType: "真实", amount: 5 }
            ],
            occupied: true,
            description: "被动：免疫，对手回合开始HIV者受基础真伤；主动占：全场HIV，50% 1倍/50% 4倍基础伤，然后基础伤翻倍"
          },
          { 
            name: "讲个冷笑话", 
            effects: [
              { type: "技能失效", chance: 50 },
              { type: "反弹", damageType: "所有", amount: 40, conditional: true }
            ],
            occupied: true,
            description: "下回合对方技能50%失效，50%成功但若伤害则反弹40%"
          },
          { 
            name: "包子客", 
            effects: [{ type: "判定成功" }],
            occupied: false,
            limited: 2,
            description: "下次判定成功"
          }
        ]
      },
      {
        name: "茄子",
        hp: 80,
        maxHp: 80,
        skills: [
          { 
            name: "召唤父亲们", 
            effects: [{ type: "召唤", min: 1, max: 2, maxTotal: 3 }],
            occupied: true,
            description: "召1~2父，最多3场，死者不复生"
          },
          { 
            name: "画画", 
            effects: [{ type: "复制技能", reducedEffect: 50 }],
            occupied: true,
            description: "复制一个未复制过的主动技能，伤害/治疗减半"
          },
          { 
            name: "废了", 
            effects: [{ type: "回合失效", target: "对手" }],
            occupied: true,
            limited: true,
            description: "对方上回合所有行动失效"
          }
        ]
      },
      {
        name: "狗",
        hp: 60,
        maxHp: 60,
        skills: [
          { 
            name: "妈！滚", 
            damage: { type: "所有", amount: 5 }, 
            effects: [{ type: "减伤", target: "所有", amount: 2 }],
            occupied: true,
            description: "全体5伤+下次攻伤-2 (效果可叠加)"
          },
          { 
            name: "跆拳道", 
            damage: { type: "物理", amount: 8 }, 
            effects: [{ type: "治疗", amount: 3 }],
            occupied: true,
            description: "8伤+自回3"
          },
          { 
            name: "狗神附体", 
            effects: [
              { type: "被动" },
              { type: "先攻" },
              { 
                type: "条件效果", 
                condition: "30≤HP≤50", 
                effects: [{ type: "资源", amount: 2 }]
              },
              { 
                type: "条件效果", 
                condition: "HP<30", 
                effects: [
                  { type: "资源", amount: 3 },
                  { type: "免控", chance: 50 },
                  { type: "必中" },
                  { type: "治疗加成", skill: "跆拳道", multiplier: 2 }
                ]
              }
            ],
            description: "被动：1.必定先攻 2. 30≤HP≤50：每回合2资源 3. HP<30：每回合3资源，50%免控，攻击必中，二技能回血翻倍"
          }
        ]
      }
    ];

    this.gameState = {
      player: null,
      ai: null,
      currentPlayer: null,
      turn: 1,
      gameActive: false,
      battleLog: [],
      playerResources: 1,
      aiResources: 1,
      playerUsedOccupiedSkill: false,
      aiUsedOccupiedSkill: false,
      playerEffects: {},
      aiEffects: {},
      playerSummoned: [],
      aiSummoned: []
    };

    this.initializeGame();
  }

  initializeGame() {
    this.renderCharacterSelection();
    this.setupEventListeners();
  }

  renderCharacterSelection() {
    const container = document.querySelector('.character-grid');
    container.innerHTML = '';

    this.characters.forEach(character => {
      const card = document.createElement('div');
      card.className = 'character-card';
      card.innerHTML = `
        <h3>${character.name}</h3>
        <div class="hp">HP: ${character.hp}</div>
        <div class="skills-list">
          <h4>技能:</h4>
          ${character.skills.map(skill => `
            <div class="skill-item">
              <strong>${skill.name}</strong>: ${skill.description}
            </div>
          `).join('')}
        </div>
      `;
      card.addEventListener('click', () => this.selectCharacter(character));
      container.appendChild(card);
    });
  }

  selectCharacter(character) {
    this.gameState.player = JSON.parse(JSON.stringify(character));
    
    // Remove selected character from available AI characters
    const availableCharacters = this.characters.filter(c => c.name !== character.name);
    this.gameState.ai = JSON.parse(JSON.stringify(availableCharacters[Math.floor(Math.random() * availableCharacters.length)]));
    
    this.startBattle();
  }

  randomSelectCharacter() {
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.selectCharacter(this.characters[randomIndex]);
  }

  startBattle() {
    document.getElementById('character-selection-screen').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    
    this.gameState.gameActive = true;
    this.gameState.currentPlayer = this.gameState.player;
    this.gameState.turn = 1;
    this.gameState.playerResources = 1;
    this.gameState.aiResources = 1;
    
    this.updateBattleDisplay();
    this.addToBattleLog(`战斗开始！${this.gameState.player.name} VS ${this.gameState.ai.name}`, 'system');
    this.addToBattleLog(`${this.gameState.player.name} 先攻`, 'system');
    
    this.renderSkills();
  }

  updateBattleDisplay() {
    // Update player display
    document.querySelector('#player-display h3').textContent = this.gameState.player.name;
    document.querySelector('#player-hp-text').textContent = `HP: ${this.gameState.player.hp}/${this.gameState.player.maxHp}`;
    document.querySelector('#player-hp-bar').style.width = `${(this.gameState.player.hp / this.gameState.player.maxHp) * 100}%`;
    
    // Update AI display
    document.querySelector('#ai-display h3').textContent = this.gameState.ai.name;
    document.querySelector('#ai-hp-text').textContent = `HP: ${this.gameState.ai.hp}/${this.gameState.ai.maxHp}`;
    document.querySelector('#ai-hp-bar').style.width = `${(this.gameState.ai.hp / this.gameState.ai.maxHp) * 100}%`;
    
    // Update resources display
    document.getElementById('player-resources').textContent = `行动资源: ${this.gameState.playerResources}`;
    document.getElementById('ai-resources').textContent = `行动资源: ${this.gameState.aiResources}`;
  }

  renderSkills() {
    const playerSkillsContainer = document.getElementById('player-skills');
    playerSkillsContainer.innerHTML = '';
    
    this.gameState.player.skills.forEach((skill, index) => {
      // Skip passive skills
      if (skill.effects && skill.effects.some(e => e.type === "被动")) return;
      
      const skillBtn = document.createElement('div');
      skillBtn.className = `skill-btn ${skill.occupied ? 'occupied' : 'non-occupied'}`;
      skillBtn.innerHTML = `
        <div class="skill-name">${skill.name} ${skill.occupied ? '(占回合)' : '(不占回合)'}</div>
        <div class="skill-desc">${skill.description}</div>
      `;
      
      // Check if skill is limited and used up
      if (skill.limited && (this.gameState.playerEffects[`${skill.name}_used`] >= skill.limited)) {
        skillBtn.disabled = true;
        skillBtn.style.opacity = '0.5';
      }
      
      skillBtn.addEventListener('click', () => this.usePlayerSkill(index));
      playerSkillsContainer.appendChild(skillBtn);
    });
  }

  usePlayerSkill(skillIndex) {
    if (!this.gameState.gameActive || this.gameState.currentPlayer !== this.gameState.player) return;
    
    const skill = this.gameState.player.skills[skillIndex];
    
    // Check if player has enough resources
    if (skill.occupied && this.gameState.playerResources < 1) {
      this.addToBattleLog("资源不足，无法使用占回合技能！", 'system');
      return;
    }
    
    // Check if limited skill is used up
    if (skill.limited) {
      const usedCount = this.gameState.playerEffects[`${skill.name}_used`] || 0;
      if (usedCount >= skill.limited) {
        this.addToBattleLog("限定技已使用完毕！", 'system');
        return;
      }
    }
    
    this.executeSkill(this.gameState.player, this.gameState.ai, skill, 'player');
    
    // Update resources
    if (skill.occupied) {
      this.gameState.playerResources -= 1;
      this.gameState.playerUsedOccupiedSkill = true;
    }
    
    // Mark limited skill as used
    if (skill.limited) {
      const usedCount = this.gameState.playerEffects[`${skill.name}_used`] || 0;
      this.gameState.playerEffects[`${skill.name}_used`] = usedCount + 1;
    }
    
    this.updateBattleDisplay();
    this.checkGameOver();
    
    // End turn if occupied skill was used
    if (skill.occupied || this.gameState.playerResources <= 0) {
      setTimeout(() => this.endPlayerTurn(), 1000);
    } else {
      // Refresh skills to show updated state
      this.renderSkills();
    }
  }

  executeSkill(user, target, skill, userType) {
    const isPlayer = userType === 'player';
    const logUser = isPlayer ? 'player' : 'ai';
    const logTarget = isPlayer ? 'ai' : 'player';
    
    this.addToBattleLog(`${user.name} 使用了技能 "${skill.name}"`, logUser);
    
    // Apply damage
    if (skill.damage) {
      let damage = skill.damage.amount;
      
      // Check for damage modifiers
      if (isPlayer && this.gameState.playerEffects["下次伤害增伤"]) {
        damage += this.gameState.playerEffects["下次伤害增伤"];
        delete this.gameState.playerEffects["下次伤害增伤"];
      } else if (!isPlayer && this.gameState.aiEffects["下次伤害增伤"]) {
        damage += this.gameState.aiEffects["下次伤害增伤"];
        delete this.gameState.aiEffects["下次伤害增伤"];
      }
      
      // Apply damage to target
      target.hp -= damage;
      this.addToBattleLog(`${target.name} 受到 ${damage} 点${skill.damage.type}伤害`, 'damage');
    }
    
    // Apply healing
    if (skill.effects) {
      const healEffect = skill.effects.find(e => e.type === "治疗");
      if (healEffect) {
        user.hp = Math.min(user.maxHp, user.hp + healEffect.amount);
        this.addToBattleLog(`${user.name} 恢复了 ${healEffect.amount} 点生命值`, 'heal');
      }
    }
    
    // Apply effects
    if (skill.effects) {
      skill.effects.forEach(effect => {
        switch (effect.type) {
          case "晕眩":
            if (isPlayer) {
              this.gameState.aiEffects["晕眩"] = true;
            } else {
              this.gameState.playerEffects["晕眩"] = true;
            }
            this.addToBattleLog(`${target.name} 被晕眩，下回合跳过`, logTarget);
            break;
            
          case "被靠标记":
            if (isPlayer) {
              this.gameState.aiEffects["被靠标记"] = (this.gameState.aiEffects["被靠标记"] || 0) + 1;
            } else {
              this.gameState.playerEffects["被靠标记"] = (this.gameState.playerEffects["被靠标记"] || 0) + 1;
            }
            this.addToBattleLog(`${target.name} 的技能被标记为"被靠"`, logTarget);
            break;
            
          case "必中":
            if (isPlayer) {
              this.gameState.playerEffects["必中"] = true;
            } else {
              this.gameState.aiEffects["必中"] = true;
            }
            this.addToBattleLog(`${user.name} 的下次攻击将必中`, logUser);
            break;
            
          case "增伤":
            if (effect.nextOnly) {
              if (isPlayer) {
                this.gameState.playerEffects["下次伤害增伤"] = effect.amount;
              } else {
                this.gameState.aiEffects["下次伤害增伤"] = effect.amount;
              }
              this.addToBattleLog(`${user.name} 的下次攻击将增加 ${effect.amount} 点伤害`, logUser);
            }
            break;
        }
      });
    }
  }

  endPlayerTurn() {
    this.gameState.currentPlayer = this.gameState.ai;
    this.gameState.playerResources = 1; // Reset player resources for next turn
    this.gameState.playerUsedOccupiedSkill = false;
    
    // Clear temporary effects
    delete this.gameState.playerEffects["被靠标记"];
    
    this.updateBattleDisplay();
    this.addToBattleLog(`${this.gameState.ai.name} 的回合开始`, 'system');
    
    // AI takes turn after a short delay
    setTimeout(() => this.aiTurn(), 1500);
  }

  aiTurn() {
    if (!this.gameState.gameActive) return;
    
    // Simple AI logic - select a random available skill
    const availableSkills = this.gameState.ai.skills.filter(skill => {
      // Skip passive skills
      if (skill.effects && skill.effects.some(e => e.type === "被动")) return false;
      
      // Check if limited skill is used up
      if (skill.limited) {
        const usedCount = this.gameState.aiEffects[`${skill.name}_used`] || 0;
        return usedCount < skill.limited;
      }
      
      return true;
    });
    
    if (availableSkills.length > 0) {
      const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      this.executeSkill(this.gameState.ai, this.gameState.player, randomSkill, 'ai');
      
      // Update resources
      if (randomSkill.occupied) {
        this.gameState.aiResources -= 1;
        this.gameState.aiUsedOccupiedSkill = true;
      }
      
      // Mark limited skill as used
      if (randomSkill.limited) {
        const usedCount = this.gameState.aiEffects[`${randomSkill.name}_used`] || 0;
        this.gameState.aiEffects[`${randomSkill.name}_used`] = usedCount + 1;
      }
    }
    
    this.updateBattleDisplay();
    this.checkGameOver();
    
    // End AI turn
    setTimeout(() => this.endAiTurn(), 1000);
  }

  endAiTurn() {
    this.gameState.currentPlayer = this.gameState.player;
    this.gameState.aiResources = 1; // Reset AI resources for next turn
    this.gameState.aiUsedOccupiedSkill = false;
    
    // Clear temporary effects
    delete this.gameState.aiEffects["被靠标记"];
    
    this.gameState.turn++;
    this.updateBattleDisplay();
    this.renderSkills();
    this.addToBattleLog(`第 ${this.gameState.turn} 回合开始`, 'system');
    this.addToBattleLog(`${this.gameState.player.name} 的回合开始`, 'system');
  }

  addToBattleLog(message, type = 'system') {
    const logContainer = document.getElementById('battle-log');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Store in game state for potential replay
    this.gameState.battleLog.push({ message, type });
  }

  checkGameOver() {
    if (this.gameState.player.hp <= 0) {
      this.gameState.player.hp = 0;
      this.endGame(false);
    } else if (this.gameState.ai.hp <= 0) {
      this.gameState.ai.hp = 0;
      this.endGame(true);
    }
    
    this.updateBattleDisplay();
  }

  endGame(playerWon) {
    this.gameState.gameActive = false;
    
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    const resultTitle = document.getElementById('result-title');
    const resultIcon = document.getElementById('result-icon');
    
    if (playerWon) {
      resultTitle.textContent = '胜利!';
      resultTitle.className = 'result-title result-won';
      resultIcon.className = 'result-icon fas fa-trophy';
      resultIcon.style.color = '#4ade80';
      this.addToBattleLog(`恭喜！${this.gameState.player.name} 获得了胜利！`, 'system');
    } else {
      resultTitle.textContent = '失败!';
      resultTitle.className = 'result-title result-lost';
      resultIcon.className = 'result-icon fas fa-skull';
      resultIcon.style.color = '#f87171';
      this.addToBattleLog(`${this.gameState.ai.name} 获得了胜利！`, 'system');
    }
    
    // Show final stats
    document.getElementById('final-player-name').textContent = this.gameState.player.name;
    document.getElementById('final-player-hp').textContent = this.gameState.player.hp;
    document.getElementById('final-ai-name').textContent = this.gameState.ai.name;
    document.getElementById('final-ai-hp').textContent = this.gameState.ai.hp;
    document.getElementById('total-turns').textContent = this.gameState.turn;
  }

  resetGame() {
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('character-selection-screen').classList.remove('hidden');
    
    // Reset game state
    this.gameState = {
      player: null,
      ai: null,
      currentPlayer: null,
      turn: 1,
      gameActive: false,
      battleLog: [],
      playerResources: 1,
      aiResources: 1,
      playerUsedOccupiedSkill: false,
      aiUsedOccupiedSkill: false,
      playerEffects: {},
      aiEffects: {},
      playerSummoned: [],
      aiSummoned: []
    };
    
    // Clear battle log
    document.getElementById('battle-log').innerHTML = '';
  }

  setupEventListeners() {
    document.getElementById('random-select').addEventListener('click', () => this.randomSelectCharacter());
    document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
    document.getElementById('play-again').addEventListener('click', () => this.resetGame());
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new RPGGame();
  window.rpgGame = game; // Make it available globally for debugging
});
