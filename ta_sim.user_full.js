// ==UserScript==
// @name           Tiberium Alliances Combat Simulator
// @description    Allows you to simulate combat before actually attacking.
// @namespace      https://prodgame*.alliances.commandandconquer.com/*/index.aspx* 
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version        1.1.0
// @author         WildKatana
// @require        http://sizzlemctwizzle.com/updater.php?id=130344&days=1
// ==/UserScript==

/**
 * TODO - Close the Pro box when going to a different view
 * TODO - Add other optimization flavors
 * 	- Go back each time or progressive
 *  - Start from 8, 4, 2, 1, or 0
 * FIXME - A troop strength of 0 doesn't show anything
 */

(function(){
  var TASuite_mainFunction = function() {
    function createTweak() {
      var TASuite = {};
      qx.Class.define("TASuite.main", {
        type: "singleton",
        extend: qx.core.Object,
        members: {
          buttonSimulateCombat: null,
          buttonReturnSetup: null,
          buttonProTools: null,
          buttonOptimize: null,
          troopDamageLabel: null,
          battleResultsBox: null,
          simVictoryLabel: null,
          add_ArmyChanged: null,
          simTroopDamageLabel: null,
          lastPercentage: null,
          lastVictory: null,
          saved_units: null,
          optimizing: null,
          ajaxImage: null,
          timerOn: null,
          initialize: function() {
          	this.add_ArmyChanged = (new System.EventHandler).$ctor(this, this.onUnitMoved);
            this.buttonSimulateCombat = new qx.ui.form.Button("Simulate");
            this.buttonSimulateCombat.set({width: 80, appearance: "button-text-small", toolTipText: "Start Combat Simulation"});
            this.buttonSimulateCombat.addListener("click", this.startSimulation, this);
            
            this.buttonProTools = new qx.ui.form.Button("Pro");
            this.buttonProTools.set({width: 50, appearance: "button-text-small", toolTipText: "Open Pro Simulator Tools"});
            this.buttonProTools.addListener("click", this.togglePro, this);
            
            this.buttonReturnSetup = new qx.ui.form.Button("Setup");
            this.buttonReturnSetup.set({width: 80, appearance: "button-text-small", toolTipText: "Return to Combat Setup"});
            this.buttonReturnSetup.addListener("click", this.returnSetup, this);
            
            this.buttonOptimize = new qx.ui.form.Button("Optimize");
            this.buttonOptimize.set({width: 80, appearance: "button-text-small", toolTipText: "Attempt to optimize your setup"});
            this.buttonOptimize.addListener("click", this.optimizeLayout, this);
            
            // TODO - Change this to a secure image with https
            this.ajaxImage = new qx.ui.basic.Image("http://www.leightonwhiting.com/ajax-loader.gif");
            this.ajaxImage.setVisibility("none");
            this.ajaxImage.setThemedAlignX("center");
            
            // The Battle Simulator Pro box
            this.battleResultsBox = new qx.ui.window.Window("Battle Simulator Pro");
            this.battleResultsBox.setPadding(10);
					  this.battleResultsBox.setLayout(new qx.ui.layout.VBox(10));
					  this.battleResultsBox.setShowMaximize(false);
					  this.battleResultsBox.setShowMinimize(false);
					  this.battleResultsBox.moveTo(115, 265);
					  this.battleResultsBox.setHeight(215);
					  this.battleResultsBox.setWidth(200);
					  this.battleResultsBox.getApplicationRoot().set({
						  blockerColor: '#000000',
						  blockerOpacity: 0.6
						});
					  // The inner Vertical Box
					  var vBox = new qx.ui.container.Composite()
					  vBox.setLayout(new qx.ui.layout.VBox(5));
					  vBox.setThemedFont("bold");
						vBox.setThemedPadding(2);
						vBox.setThemedBackgroundColor("#eef");
						// The Troop Strength Label
					  var hBox1 = new qx.ui.container.Composite()
					  hBox1.setLayout(new qx.ui.layout.HBox(5));
					  hBox1.add(new qx.ui.basic.Label("Troop Strength: "));
					  this.simTroopDamageLabel = new qx.ui.basic.Label("100%");
						hBox1.add(this.simTroopDamageLabel);
						this.simTroopDamageLabel.setThemedTextColor("blue");
						vBox.add(hBox1);
						// The Victory Label
						var hBox2 = new qx.ui.container.Composite()
					  hBox2.setLayout(new qx.ui.layout.HBox(5));
					  hBox2.add(new qx.ui.basic.Label("Victory: "));
					  this.simVictoryLabel = new qx.ui.basic.Label("Yes");
						hBox2.add(this.simVictoryLabel);
						this.simVictoryLabel.setThemedTextColor("green");
						vBox.add(hBox2);
						this.battleResultsBox.add(vBox);
						this.battleResultsBox.add(this.ajaxImage);
						// The Optimize button
						this.battleResultsBox.add(this.buttonOptimize);
            
            var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
            armyBar.add(this.buttonSimulateCombat, {top: 130, right: 0});
            armyBar.add(this.buttonProTools, {top: 150, right: 0});
            
            var replayBar = qx.core.Init.getApplication().getReportReplayOverlay();
            replayBar.add(this.buttonReturnSetup, {top: 10, right: 80});
            
            this.troopDamageLabel = new qx.ui.basic.Label().set({
					    value: "<span style='color: black; font-weight: bold;'>Troop Strength: 100%</span>",
					    rich : true
					  });
						replayBar.add(this.troopDamageLabel, { right : 100, top: 30});
            
            qx.core.Init.getApplication()._onDesktopResize();
          },
          togglePro: function() {
          	var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
          	if (this.battleResultsBox.isVisible()) {
          		armyBar.__qx.remove_ArmyChanged(this.add_ArmyChanged);
          		this.battleResultsBox.close();
          	}
          	else {
          		// Add the event listener for armybar
	            try {
	            	armyBar.__qx.add_ArmyChanged(this.add_ArmyChanged);
	            }
	            catch (e) {
	            	console.log(e);
	            }
          		
          		this.updateProWindow();
          		this.battleResultsBox.moveTo(115, 265);
						  this.battleResultsBox.setHeight(215);
						  this.battleResultsBox.setWidth(200);
          		this.battleResultsBox.open();
          	}
          },
          returnSetup: function() {
            // Set the scene again, just in case it didn't work the first time
            var app = qx.core.Init.getApplication();
            var player_cities =ClientLib.Data.MainData.GetInstance().get_Cities();
            var current_city = player_cities.get_CurrentCity();
            app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatSetupDefense, localStorage.ta_sim_last_city, 0, 0);
          },
          optimizeLayout: function() {
          	try {
          		// First, get the CityPreArmyUnits
	          	var units = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP).__qx;
          		if (this.battleResultsBox.isModal()) {
          			this.optimizingDone();
          			this.updateFormation();
          		}
          		else {
	          		this.battleResultsBox.setModal(true);
	          		this.battleResultsBox.setAllowClose(false);
	          		this.buttonOptimize.setLabel("Cancel");
	          		this.ajaxImage.setVisibility("visible");
	          		this.optimizing = true;
	          		for (var i = 2; i >= 0; i--) {
	          			if (this.checkBetterFormation(units, i)) {
	          				break;
	          			}
	          		}
          		}
          	}
          	catch(e) {
          		console.log(e);
          	}
          	
          	this.updateProWindow();
          },
          optimizingDone: function() {
          	console.log("Optimizing Done");
          	this.buttonOptimize.setLabel("Optimize");
      			this.battleResultsBox.setAllowClose(true);
      			this.battleResultsBox.setModal(false);
      			this.optimizing = false;
      			this.ajaxImage.setVisibility("none");
      			this.timerOn = false;
          },
          updateFormation: function() {
          	var units = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP).__qx;
          	console.log("Updating Formation");
          	this.restoreFormation(units.m_ArmyUnits.l);
          	units.UpdateArmyLayout$0();
          	units.RefreshData$0();
          },
          checkBetterFormation: function(units, degree) {
          	this.calculateSimResults();
          	this.saveFormation(units.m_ArmyUnits.l);
          	
          	var order = [];
						for (var i = 0; i < units.m_ArmyUnits.l.length; i++){
						  order.push(i);
						}
						
						// Randomize the units order
						var tmp, current, top = order.length;
						
				    if(top) while(--top) {
			        current = Math.floor(Math.random() * (top + 1));
			        tmp = order[current];
			        order[current] = order[top];
			        order[top] = tmp;
				    }
            
            var i = 0;
            var _this = this;
            
            function nudgeUnit(context) {
            	_this.timerOn = false;
            	var saved_percentage = _this.lastPercentage;
            	if (i < (order.length - 1)) {
            		i++;
				        var unit = units.m_ArmyUnits.l[order[i]];
	          		var x = unit.get_CoordX();
	          		var y = unit.get_CoordY();
	          		
	          		console.log("Checking Unit");
	          		
	          		// Move the unit around and see if the percentage is higher. If it is, then we save the new layout. Also, make sure that the victory is yes
	          		while (true) {
		          		if ((x - degree) > 0) {
		          			// Move left
		          			unit.MoveBattleUnit((x - degree) - 1, y);
		          			if (_this.checkNewResults(units, unit, saved_percentage)) {
		          				saved_percentage = _this.lastPercentage;
		          				_this.updateFormation();
		          				break;
		          			}
		          			else unit.MoveBattleUnit(x, y);
		          		}
		          		if ((x + degree) < 7) {
		          			// Move right
		          			unit.MoveBattleUnit((x + degree) + 1, y);
		          			if (_this.checkNewResults(units, unit, saved_percentage)) {
		          				saved_percentage = _this.lastPercentage;
		          				_this.updateFormation();
		          				break;
		          			}
		          			else unit.MoveBattleUnit(x, y);
		          		}
		          		if ((y - degree) > 0) {
		          			// Move up
		          			unit.MoveBattleUnit(x, (y - degree) - 1);
		          			if (_this.checkNewResults(units, unit, saved_percentage)) {
		          				saved_percentage = _this.lastPercentage;
		          				_this.updateFormation();
		          				break;
		          			}
		          			else unit.MoveBattleUnit(x, y);
		          		}
		          		if (y + degree < 3) {
		          			// Move down
		          			unit.MoveBattleUnit(x, y + degree + 1);
		          			if (_this.checkNewResults(units, unit, saved_percentage)) {
		          				saved_percentage = _this.lastPercentage;
		          				_this.updateFormation();
		          				break;
		          			}
		          			else unit.MoveBattleUnit(x, y);
		          		}
		          		break;
	          		}
	          		
	          		if (_this.optimizing) {
	          			if (!_this.timerOn) {
	          				_this.timerOn = true;
	          				setTimeout(nudgeUnit, 200);
	          			}
	          		}
				      }
				      else {
				      	_this.optimizingDone();
				      	_this.updateFormation();
				      }
            }
            
            this.timerOn = true;
            setTimeout(nudgeUnit, 0);
          	
          	return false;
          },
          checkNewResults: function(units, unit, saved_percentage) {
          	this.calculateSimResults();
          	
						if (this.lastVictory && this.lastPercentage > saved_percentage) {
							console.log(this.lastPercentage.toString() + " is better than " + saved_percentage.toString());
							this.saveFormation(units.m_ArmyUnits.l);
	      			return true;
						}
						
	      		return false;
          },
          restoreFormation: function(units) {
          	for (var i = 0; (i < units.length); i++) {
							var saved_unit = this.saved_units[i];
							units[i].m_CoordX = saved_unit.x;
							units[i].m_CoordY = saved_unit.y;
							units[i].m_UnitId = saved_unit.id;
						}
          },
          saveFormation: function(units) {
          	this.saved_units = [];
          	for (var i = 0; (i < units.length); i++) {
							var unit = units[i];
							var armyUnit = {};
							armyUnit.x = unit.m_CoordX;
							armyUnit.y = unit.m_CoordY;
							armyUnit.id = unit.m_UnitId;
							this.saved_units.push(armyUnit);
						}
          },
          calculateTroopStrength: function(battleground) {
          	var total_hp = 0;
            var end_hp = 0;
            
            for (i in battleground.m_Entities.d) {
            	var entity = battleground.m_Entities.d[i];
						  if (entity.get_Entity$0().m_eAlignment == SharedLib.Combat.ECbtAlignment.Attacker) {
						  	// This is one of the good guys
						  	total_hp += entity.m_Entity.m_iHitpoints;
						  	end_hp += entity.m_Entity.m_iHitpointsCurrent;
						  }
					  }
					  
					  return percentage = Math.floor((end_hp / total_hp) * 100);
          },
          updateTroopStrength: function(battleground) {
					  var percentage = this.calculateTroopStrength(battleground);
					  
					  this.troopDamageLabel.setValue("<span style='color: black; font-weight: bold;'>Troop Strength: " + percentage.toString() + "%</span>");
          },
          onUnitMoved: function(sender, e) {
          	window.TASuite.main.getInstance().updateProWindow();
          },
          onDamageDone: function(sender, e) {
          	// Try to update the Troop Strength meter
						try {
	            battleground = sender.DamageDone.i[0].o;
	            // For the sake of performance, only run this every 10th step
	            if (battleground.m_CurrentStep % 10 == 0) {
		            window.TASuite.main.getInstance().updateTroopStrength(battleground);
						  }
						}
	          catch (e) {
	          	console.log(e);
	          }
          },
          onDefenseDestroyed: function(sender, e) {
          	// Try to update the Troop Strength meter
						try {
	            battleground = sender.DamageDone.i[0].o;
		          window.TASuite.main.getInstance().updateTroopStrength(battleground);
						}
	          catch (e) {
	          	console.log(e);
	          }
          },
          calculateSimResults: function() {
          	var battleground = this.setupBattleground();
            
            // Run the simulation through 2000 steps
						for (var i=0;i<=2000;i++) {
						  battleground.m_Simulation.DoStep$0();
						}
						
					  var percentage = this.calculateTroopStrength(battleground);
					  
					  this.lastPercentage = percentage;
					  this.lastVictory = battleground.m_Simulation.m_bDestroyDefense;
          },
          updateProWindow: function() {
          	this.calculateSimResults();
          	
          	var victory = "No";
					  if (this.lastVictory) {
					  	victory = "Yes";
					  }
					  
					  this.simTroopDamageLabel.setValue(this.lastPercentage);
					  this.simVictoryLabel.setValue(victory);
          },
          setupBattleground: function() {
          	var app = qx.core.Init.getApplication();
            var vis_main = ClientLib.Vis.VisMain.GetInstance();
            var battleground = vis_main.get_Battleground();
            var player_cities = ClientLib.Data.MainData.GetInstance().get_Cities();
            var current_city = player_cities.get_CurrentCity();
            var own_city = player_cities.get_CurrentOwnCity();
            localStorage.ta_sim_last_city = current_city.get_Id();
            
            // First reset the battlefield
            battleground.Reset();
            battleground.m_CurrentReplay = null;
            //app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
            battleground.InitBattle();
            battleground.m_BattleDuration = (1200 * Math.floor(0x3e8 / battleground.m_SimSetup.get_SubSteps$0()));
            
            // Let's add the bonuses for POI
            var alliance = ClientLib.Data.MainData.GetInstance().m_Alliance;
            try {
              battleground.set_BoostOffInfantry(alliance.get_POIInfantryBonus());
              battleground.set_BoostOffVehicles(alliance.get_POIVehicleBonus());
              battleground.set_BoostOffAir(alliance.get_POIAirBonus());
              battleground.set_BoostDef(current_city.m_AllianceDefenseBonus);
            }
            catch (e) {
              console.log(e);
            }
            
            // Add the offense, defense and base
            battleground.AddOffense(own_city.m_CityArmyFormationsManager.m_ArmyFormations.d[own_city.m_CityArmyFormationsManager.m_CurrentTargetBaseId]);
            battleground.AddDefense(current_city.get_CityUnitsData());
            battleground.AddBase(current_city);
            battleground.SetDefender(current_city.get_Name(), current_city.get_OwnerName(), current_city.get_OwnerAllianceName(), current_city.get_CityFaction());
            
            // Initiation
            battleground.StartBattle();
            battleground.RestartReplay();
            
            return battleground;
          },
          startSimulation: function() {
          	var app = qx.core.Init.getApplication();
          	var player_cities = ClientLib.Data.MainData.GetInstance().get_Cities();
          	var current_city = player_cities.get_CurrentCity();
          	
          	window.TASuite.main.getInstance().troopDamageLabel.setValue("<span style='color: black; font-weight: bold;'>Troop Strength: 100%</span>");
            
            app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
            var battleground = this.setupBattleground();
            
            // Add the event listeners
            battleground.m_Simulation.add_DamageDone$0((new System.EventHandler).$ctor(this, this.onDamageDone));
            battleground.m_Simulation.add_OnDestroyDefense$0((new System.EventHandler).$ctor(this,this.onDefenseDestroyed));
            
            // Set the scene again, just in case it didn't work the first time
            app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
          }
        }
      });
    }
    
    function TASuite_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          a = qx.core.Init.getApplication(); // application
          mb = qx.core.Init.getApplication().getMenuBar();
          if (a && mb) {
            createTweak();
            window.TASuite.main.getInstance().initialize();
          } else
            window.setTimeout(TASuite_checkIfLoaded, 1000);
        } else {
          window.setTimeout(TASuite_checkIfLoaded, 1000);
        }
      } catch (e) {
        if (typeof console != 'undefined') console.log(e);
        else if (window.opera) opera.postError(e);
        else GM_log(e);
      }
    }
    
    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(TASuite_checkIfLoaded, 1000);
    }
  }

  // injecting, because there seem to be problems when creating game interface with unsafeWindow
  var TASuiteScript = document.createElement("script");
  var txt = TASuite_mainFunction.toString();
  TASuiteScript.innerHTML = "(" + txt + ")();";
  TASuiteScript.type = "text/javascript";
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName("head")[0].appendChild(TASuiteScript);
  }

})();