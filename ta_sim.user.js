// ==UserScript==
// @name           Tiberium Alliances Combat Simulator
// @description    Allows you to simulate combat before actually attacking.
// @namespace      https://prodgame*.alliances.commandandconquer.com/*/index.aspx* 
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version        1.3.0
// @author         WildKatana
// @require        http://sizzlemctwizzle.com/updater.php?id=130344&days=1
// ==/UserScript==
(function () {
  var TASuite_mainFunction = function () {
      function createTweak() {
        var TASuite = {};
        qx.Class.define("TASuite.main", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            buttonSimulateCombat: null,
            buttonReturnSetup: null,
            attacker_modules: null,
            defender_modules: null,
            initialize: function () {
              this.buttonSimulateCombat = new qx.ui.form.Button("Simulate");
              this.buttonSimulateCombat.set({
                width: 80,
                appearance: "button-text-small",
                toolTipText: "Start Combat Simulation"
              });
              this.buttonSimulateCombat.addListener("click", this.startSimulation, this);

              this.buttonReturnSetup = new qx.ui.form.Button("Setup");
              this.buttonReturnSetup.set({
                width: 80,
                appearance: "button-text-small",
                toolTipText: "Return to Combat Setup"
              });
              this.buttonReturnSetup.addListener("click", this.returnSetup, this);

              _this = this;
              setTimeout(function () {
                try {
                  // Get the active modules
                  // Doing this the hard and unreliable way for now, until we figure out a better way
                  _this.attacker_modules = {};
                  var g = ClientLib.Res.ResMain.GetInstance();
                  var player_research = ClientLib.Data.MainData.GetInstance().get_Player().get_PlayerResearch();
                  _this.attacker_modules.l = [];
                  for (var i in g.YEJ.units) {
                    var ug = g.GetUnit_Obj(i);
                    var research = player_research.GetResearchItemFomMdbId(ug.tl);
                    var modules = ug.m;
                    for (var j in modules) {
                      var module = modules[j];
                      if (module.t == 1) {
                        _this.attacker_modules.l.push(module.i);
                      }
                      if (research && module.t == 3 && research.m_Level == 2) {
                        _this.attacker_modules.l.push(module.i);
                      }
                    }
                  }

                  _this.defender_modules = _this.attacker_modules;
                } catch (e) {
                  console.log(e);
                }
              }, 10000);

              var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
              armyBar.add(this.buttonSimulateCombat, {
                top: 130,
                right: 0
              });
            },
            returnSetup: function () {
              // Set the scene again, just in case it didn't work the first time
              var app = qx.core.Init.getApplication();
              var player_cities = ClientLib.Data.MainData.GetInstance().get_Cities();
              var current_city = player_cities.get_CurrentCity();
              try {
                app.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatSetupDefense, localStorage.ta_sim_last_city, 0, 0);
              } catch (e) {
                app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatSetupDefense, localStorage.ta_sim_last_city, 0, 0);
              }
            },
            setupBattleground: function () {
              try {
                var mainData = ClientLib.Data.MainData.GetInstance();
                var player_cities = mainData.get_Cities();
                var current_city = player_cities.get_CurrentCity();
                var own_city = player_cities.get_CurrentOwnCity();

                localStorage.ta_sim_last_city = current_city.get_Id();

                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                //var combatData = (new $I.CM).$ctor();
                var combatData = (new $I.CM).QB();
                combatData.m_Version = 1;
                
                var unitData = own_city.get_CityUnitsData().HIG.l;
                var data = new Array();

                for (var i = 0; i < unitData.length; i++) {
                  var info = new Object();
                  info.h = unitData[i].get_Health() - unitData[i].get_CurrentDamage();
                  info.i = unitData[i].get_MdbUnitId();
                  info.l = unitData[i].get_CurrentLevel();
                  info.x = unitData[i].get_CoordX();
                  info.y = unitData[i].get_CoordY();
                  data.push(info);
                }

                combatData.TN = data; // Attackers

                unitData = current_city.get_CityUnitsData().QIG.l;
                data = new Array();
                for (i = 0; i < unitData.length; i++) {
                  info = new Object();
                  info.h = unitData[i].get_Health() - unitData[i].get_CurrentDamage();
                  info.i = unitData[i].get_MdbUnitId();
                  info.l = unitData[i].get_CurrentLevel();
                  info.x = unitData[i].get_CoordX();
                  info.y = unitData[i].get_CoordY();
                  data.push(info);
                }
                combatData.UN = data; // Defenders

                data = new Array();
                for (var i = 0;
                (i < 9); i++) {
                  for (var j = 0;
                  (j < 8); j++) {
                    var terrainType = current_city.GetResourceType(i, (j + current_city.get_Height()));
                    var unitType = -1;
                    switch (terrainType) {
                    case ClientLib.Data.ECityTerrainType.FOREST:
                        unitType = 0x7c;
                        break;
                    case ClientLib.Data.ECityTerrainType.BRIAR:
                        unitType = 0x7b;
                        break;
                    case ClientLib.Data.ECityTerrainType.SWAMP:
                        unitType = 0x7d;
                        break;
                    case ClientLib.Data.ECityTerrainType.WATER:
                        unitType = 0x7e;
                        break;
                    }
                    if (unitType != -1) {
                      info = new Object();
                      info.h = 100;
                      info.i = unitType;
                      info.l = 1;
                      info.x = i;
                      info.y = j;
                      data.push(info);
                    }
                  }
                }
                combatData.VN = data; // Terrain

                unitData = current_city.get_CityBuildingsData().ZEI.l;
                data = new Array();
                for (i = 0; i < unitData.length; i++) {
                  info = new Object();
                  info.h = unitData[i].get_Health() - unitData[i].get_CurrentDamage();
                  info.i = unitData[i].get_MdbUnitId();
                  info.l = unitData[i].get_CurrentLevel();
                  info.x = unitData[i].get_CoordX();
                  info.y = unitData[i].get_CoordY();
                  data.push(info);
                }
                
                combatData.WN = data; // Buildings

                combatData.m_Supports = null;
                combatData.m_StartStep = 5902339;
                combatData.m_CombatSteps = 1;
                combatData.m_BoostInfantry = alliance.get_POIInfantryBonus();
                combatData.m_BoostVehicle = alliance.get_POIVehicleBonus();
                combatData.m_BoostAir = alliance.get_POIAirBonus();
                combatData.m_BoostDefense = current_city.m_AllianceDefenseBonus;
                combatData.m_AttackerBaseId = own_city.get_Id();
                combatData.m_AttackerBaseName = own_city.get_Name();
                combatData.m_AttackerPlayerId = own_city.get_PlayerId();
                combatData.m_AttackerPlayerName = own_city.get_OwnerName();
                combatData.m_AttackerAllianceId = own_city.get_AllianceId();
                combatData.m_AttackerAllianceName = own_city.get_OwnerAllianceName();
                combatData.m_DefenderBaseId = current_city.get_Id();
                combatData.m_DefenderBaseName = current_city.get_Name();
                combatData.m_DefenderPlayerId = own_city.get_PlayerId();
                combatData.m_DefenderPlayerName = current_city.get_OwnerName();
                combatData.m_DefenderAllianceId = current_city.get_AllianceId();
                combatData.m_DefenderAllianceName = current_city.get_OwnerAllianceName();
                combatData.m_DefenderBlockStep = 0;
                combatData.m_AttackTimeStamp = new Date().getTime();
                var resourceLayout = new Object();
                resourceLayout.l = new Array();
                for (var i = 0;
                (i < combatData.WN.length); i++) {
                  resourceLayout.l[combatData.WN[i].y] = 0;
                }
                combatData.m_ResourceLayout = resourceLayout;
                combatData.m_DefenderFaction = current_city.get_CityFaction();
                combatData.m_AttackerModules = this.attacker_modules;
                combatData.m_DefenderModules = this.defender_modules;

                combatData.m_MaxDuration = 120;
                combatData.m_Complete = false;
                if (combatData.m_Complete) {
                  combatData.m_Id = -1;
                }
                combatData.m_Debug = null;

                var battleground = ClientLib.Vis.VisMain.GetInstance().get_Battleground();
                battleground.Reset();
                battleground.VBG = combatData;
                battleground.InitBattle();
                battleground.DXF(combatData);
                battleground.StartBattle();

                return battleground;
              } catch (e) {
                console.log(e);
              }
            },
            startSimulation: function () {
              try {
                var app = qx.core.Init.getApplication();
                var player_cities = ClientLib.Data.MainData.GetInstance().get_Cities();
                var current_city = player_cities.get_CurrentCity();

                try {
                  app.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
                } catch (e) {
                  app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
                }
                var battleground = this.setupBattleground();

                // Set the scene again, just in case it didn't work the first time
                try {
                  app.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
                } catch (e) {
                  app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatReplay, current_city.get_Id(), 0, 0);
                }
              } catch (e) {
                console.log(e);
              }
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
            } else window.setTimeout(TASuite_checkIfLoaded, 1000);
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