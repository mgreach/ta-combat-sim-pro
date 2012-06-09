// TODO - Calculate the Troop Repair Time

// Set the properties here
TASuite.main.prototype.buttonProTools = null;
TASuite.main.prototype.buttonOptimize = null;
TASuite.main.prototype.degreeSelect = null;
TASuite.main.prototype.primarySelect = null;
TASuite.main.prototype.secondarySelect = null;

TASuite.main.prototype.add_ArmyChanged = null;
TASuite.main.prototype.add_ViewModeChange = null;

TASuite.main.prototype.lastPrimary = null;
TASuite.main.prototype.lastSecondary = null;
TASuite.main.prototype.currentPrimary = null;
TASuite.main.prototype.currentSecondary = null;

TASuite.main.prototype.lastPercentage = null;
TASuite.main.prototype.lastEnemyPercentage = null;
TASuite.main.prototype.lastDFPercentage = null;
TASuite.main.prototype.lastCYPercentage = null;
TASuite.main.prototype.lastInfantryPercentage = null;
TASuite.main.prototype.lastVehiclePercentage = null;
TASuite.main.prototype.lastAirPercentage = null;
TASuite.main.prototype.lastEnemyUnitsPercentage = null;
TASuite.main.prototype.lastEnemyBuildingsPercentage = null;
TASuite.main.prototype.totalSeconds = null;

TASuite.main.prototype.lastVictory = null;
TASuite.main.prototype.saved_units = null;
TASuite.main.prototype.optimizing = null;
TASuite.main.prototype.ajaxImage = null;
TASuite.main.prototype.timerOn = null;

TASuite.main.prototype.enemyTroopStrengthLabel = null;
TASuite.main.prototype.enemyBuildingsStrengthLabel = null;
TASuite.main.prototype.enemyUnitsStrengthLabel = null;
TASuite.main.prototype.airTroopStrengthLabel = null;
TASuite.main.prototype.infantryTroopStrengthLabel = null;
TASuite.main.prototype.vehicleTroopStrengthLabel = null;
TASuite.main.prototype.CYTroopStrengthLabel = null;
TASuite.main.prototype.DFTroopStrengthLabel = null;
TASuite.main.prototype.simTroopDamageLabel = null;
TASuite.main.prototype.simVictoryLabel = null;
TASuite.main.prototype.simTimeLabel = null;

// Initialize the Pro mode
TASuite.main.prototype.initializePro = function() {
	_this = this;
	this.add_ArmyChanged = (new System.EventHandler).$ctor(this, this.onUnitMoved);
	this.add_ViewModeChange = (new ClientLib.Vis.ViewModeChange).$ctor(this, this.onViewChange);
	
	this.buttonOptimize = new qx.ui.form.Button("Optimize");
  this.buttonOptimize.set({width: 80, appearance: "button-text-small", toolTipText: "Attempt to optimize your setup"});
  this.buttonOptimize.addListener("click", this.optimizeLayout, this);
  
  this.ajaxImage = new qx.ui.basic.Image("https://dl.dropbox.com/u/41023713/loading.gif");
  this.ajaxImage.setVisibility("none");
  this.ajaxImage.setThemedAlignX("center");
  
  // The Battle Simulator Pro box
  this.battleResultsBox = new qx.ui.window.Window("Battle Simulator Pro");
  this.battleResultsBox.setPadding(10);
  this.battleResultsBox.setLayout(new qx.ui.layout.VBox(10));
  this.battleResultsBox.setShowMaximize(false);
  this.battleResultsBox.setShowMinimize(false);
  this.battleResultsBox.moveTo(115, 200);
  this.battleResultsBox.setHeight(400);
  this.battleResultsBox.setWidth(200);
  this.battleResultsBox.getApplicationRoot().set({
	  blockerColor: '#000000',
	  blockerOpacity: 0.6
	});
	// The Enemy Vertical Box
  var eVBox = new qx.ui.container.Composite()
  eVBox.setLayout(new qx.ui.layout.VBox(5));
  eVBox.setThemedFont("bold");
	eVBox.setThemedPadding(2);
	eVBox.setThemedBackgroundColor("#eef");
	this.battleResultsBox.add(eVBox);
	// The Enemy Troop Strength Label
  var eHBox1 = new qx.ui.container.Composite();
  eHBox1.setLayout(new qx.ui.layout.HBox(5));
  eHBox1.add(new qx.ui.basic.Label("Enemy Strength: "));
  this.enemyTroopStrengthLabel = new qx.ui.basic.Label("100%");
	eHBox1.add(this.enemyTroopStrengthLabel);
	this.enemyTroopStrengthLabel.setTextColor("red");
	eVBox.add(eHBox1);
	// Units
	var eHBox4 = new qx.ui.container.Composite();
  eHBox4.setLayout(new qx.ui.layout.HBox(5));
  eHBox4.add(new qx.ui.basic.Label("Units: "));
  this.enemyUnitsStrengthLabel = new qx.ui.basic.Label("100%");
	eHBox4.add(this.enemyUnitsStrengthLabel);
	this.enemyUnitsStrengthLabel.setTextColor("green");
	eVBox.add(eHBox4);
	// Buildings
	var eHBox5 = new qx.ui.container.Composite();
  eHBox5.setLayout(new qx.ui.layout.HBox(5));
  eHBox5.add(new qx.ui.basic.Label("Buildings: "));
  this.enemyBuildingsStrengthLabel = new qx.ui.basic.Label("100%");
	eHBox5.add(this.enemyBuildingsStrengthLabel);
	this.enemyBuildingsStrengthLabel.setTextColor("green");
	eVBox.add(eHBox5);
	// Command Center
	var eHBox2 = new qx.ui.container.Composite();
  eHBox2.setLayout(new qx.ui.layout.HBox(5));
  eHBox2.add(new qx.ui.basic.Label("Construction Yard: "));
  this.CYTroopStrengthLabel = new qx.ui.basic.Label("100%");
	eHBox2.add(this.CYTroopStrengthLabel);
	this.CYTroopStrengthLabel.setTextColor("red");
	eVBox.add(eHBox2);
	// Defense Facility
	var eHBox3 = new qx.ui.container.Composite();
  eHBox3.setLayout(new qx.ui.layout.HBox(5));
  eHBox3.add(new qx.ui.basic.Label("Defense Facility: "));
  this.DFTroopStrengthLabel = new qx.ui.basic.Label("100%");
	eHBox3.add(this.DFTroopStrengthLabel);
	this.DFTroopStrengthLabel.setTextColor("red");
	eVBox.add(eHBox3);
	
	// The Troops Vertical Box
  var tVBox = new qx.ui.container.Composite()
  tVBox.setLayout(new qx.ui.layout.VBox(5));
  tVBox.setThemedFont("bold");
	tVBox.setThemedPadding(2);
	tVBox.setThemedBackgroundColor("#eef");
	this.battleResultsBox.add(tVBox);
	// The Troop Strength Label
  var tHBox1 = new qx.ui.container.Composite();
  tHBox1.setLayout(new qx.ui.layout.HBox(5));
  tHBox1.add(new qx.ui.basic.Label("Troop Strength: "));
  this.simTroopDamageLabel = new qx.ui.basic.Label("100%");
	tHBox1.add(this.simTroopDamageLabel);
	this.simTroopDamageLabel.setTextColor("blue");
	tVBox.add(tHBox1);
	// The Infantry Troop Strength Label
  var tHBox2 = new qx.ui.container.Composite();
  tHBox2.setLayout(new qx.ui.layout.HBox(5));
  tHBox2.add(new qx.ui.basic.Label("Infantry: "));
  this.infantryTroopStrengthLabel = new qx.ui.basic.Label("100%");
	tHBox2.add(this.infantryTroopStrengthLabel);
	this.infantryTroopStrengthLabel.setTextColor("green");
	tVBox.add(tHBox2);
	// The Vehicle Troop Strength Label
  var tHBox3 = new qx.ui.container.Composite();
  tHBox3.setLayout(new qx.ui.layout.HBox(5));
  tHBox3.add(new qx.ui.basic.Label("Vehicle: "));
  this.vehicleTroopStrengthLabel = new qx.ui.basic.Label("100%");
	tHBox3.add(this.vehicleTroopStrengthLabel);
	this.vehicleTroopStrengthLabel.setTextColor("green");
	tVBox.add(tHBox3);
	// The Air Troop Strength Label
  var tHBox4 = new qx.ui.container.Composite();
  tHBox4.setLayout(new qx.ui.layout.HBox(5));
  tHBox4.add(new qx.ui.basic.Label("Air: "));
  this.airTroopStrengthLabel = new qx.ui.basic.Label("100%");
	tHBox4.add(this.airTroopStrengthLabel);
	this.airTroopStrengthLabel.setTextColor("green");
	tVBox.add(tHBox4);
	
  // The inner Vertical Box
  var vBox = new qx.ui.container.Composite()
  vBox.setLayout(new qx.ui.layout.VBox(5));
  vBox.setThemedFont("bold");
	vBox.setThemedPadding(2);
	vBox.setThemedBackgroundColor("#eef");
	// The Victory Label
	var hBox2 = new qx.ui.container.Composite()
  hBox2.setLayout(new qx.ui.layout.HBox(5));
  hBox2.add(new qx.ui.basic.Label("Victory: "));
  this.simVictoryLabel = new qx.ui.basic.Label("Yes");
	hBox2.add(this.simVictoryLabel);
	this.simVictoryLabel.setTextColor("green");
	vBox.add(hBox2);
	// The Battle Time Label
  var hBox1 = new qx.ui.container.Composite()
  hBox1.setLayout(new qx.ui.layout.HBox(5));
  hBox1.add(new qx.ui.basic.Label("Battle Time: "));
  this.simTimeLabel = new qx.ui.basic.Label("120");
	hBox1.add(this.simTimeLabel);
	this.simTimeLabel.setTextColor("black");
	vBox.add(hBox1);
	this.battleResultsBox.add(vBox);
	// Options for Optimize
	// Degree selector
	var hBox3 = new qx.ui.container.Composite()
  hBox3.setLayout(new qx.ui.layout.HBox(5));
  hBox3.add(new qx.ui.basic.Label("Mode: "));
	this.degreeSelect = new qx.ui.form.SelectBox();
	this.degreeSelect.add(new qx.ui.form.ListItem("Quick", null, "1"));
	var averageChoice = new qx.ui.form.ListItem("Average", null, "2");
	this.degreeSelect.add(averageChoice);
	this.degreeSelect.add(new qx.ui.form.ListItem("Thorough", null, "4"));
	this.degreeSelect.add(new qx.ui.form.ListItem("Exhaustive", null, "8"));
	this.degreeSelect.setSelection([averageChoice]);
	hBox3.add(this.degreeSelect);
	vBox.add(hBox3);
	// Primary selector
	var hBox4 = new qx.ui.container.Composite();
  hBox4.setLayout(new qx.ui.layout.HBox(5));
  hBox4.add(new qx.ui.basic.Label("Priority: "));
	this.primarySelect = new qx.ui.form.SelectBox();
	var primarySelectDefault = new qx.ui.form.ListItem("C. Yard", null, "CY");
	this.primarySelect.add(primarySelectDefault);
	this.primarySelect.add(new qx.ui.form.ListItem("Troop Strength", null, "TS"));
	this.primarySelect.add(new qx.ui.form.ListItem("Defense Facility", null, "DF"));
	this.primarySelect.add(new qx.ui.form.ListItem("Enemy Troops", null, "ES"));
	this.primarySelect.setSelection([primarySelectDefault]);
	hBox4.add(this.primarySelect);
	vBox.add(hBox4);
	// Secondary selector
	var hBox5 = new qx.ui.container.Composite();
  hBox5.setLayout(new qx.ui.layout.HBox(5));
  hBox5.add(new qx.ui.basic.Label("Secondary: "));
	this.secondarySelect = new qx.ui.form.SelectBox();
	this.secondarySelect.add(new qx.ui.form.ListItem("C. Yard", null, "CY"));
	var secondarySelectDefault = new qx.ui.form.ListItem("Troop Strength", null, "TS");
	this.secondarySelect.add(secondarySelectDefault);
	this.secondarySelect.add(new qx.ui.form.ListItem("Defense Facility", null, "DF"));
	this.secondarySelect.add(new qx.ui.form.ListItem("Enemy Troops", null, "ES"));
	this.secondarySelect.setSelection([secondarySelectDefault]);
	hBox5.add(this.secondarySelect);
	vBox.add(hBox5);
	// AJAX loader
	vBox.add(this.ajaxImage);
	// The Optimize button
	this.battleResultsBox.add(this.buttonOptimize);
	
	var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
	
	this.buttonProTools = new qx.ui.form.Button("Pro");
  this.buttonProTools.set({width: 50, appearance: "button-text-small", toolTipText: "Open Pro Simulator Tools"});
  this.buttonProTools.addListener("click", this.togglePro, this);
  armyBar.add(this.buttonProTools, {top: 17, right: 7});
  
  // Remember that this user has pro
  localStorage.setItem("tasim_pro", true);
  
  try {
		armyBar.remove(this.buttonGetProTools);
	}
	catch(e) {
		
	}
}

TASuite.main.prototype.getCityPreArmyUnits = function() {
	var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
	var units = null;
	for (var key in armyBar) {
		try {
      if (armyBar[key] instanceof ClientLib.Data.CityPreArmyUnits) {
        units = armyBar[key];
        break;
      }
    }
    catch (e) {
    	
    }
  }
  return units;
}

TASuite.main.prototype.togglePro = function() {
	var units = this.getCityPreArmyUnits();
	if (this.battleResultsBox.isVisible()) {
		units.remove_ArmyChanged(this.add_ArmyChanged);
		ClientLib.Vis.VisMain.GetInstance().remove_ViewModeChange(this.add_ViewModeChange);
		this.battleResultsBox.close();
	}
	else {
		// Add the event listener for armybar
    try {
    	units.add_ArmyChanged(this.add_ArmyChanged);
    	ClientLib.Vis.VisMain.GetInstance().add_ViewModeChange(this.add_ViewModeChange);
    }
    catch (e) {
    	console.log(e);
    }
		
		this.updateProWindow();
		this.battleResultsBox.moveTo(115, 200);
	  this.battleResultsBox.setHeight(400);
	  this.battleResultsBox.setWidth(200);
		this.battleResultsBox.open();
	}
};

TASuite.main.prototype.optimizeLayout = function() {
	try {
		// First, get the CityPreArmyUnits
  	var units = this.getCityPreArmyUnits();
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
  		// Set the current primary and secondary targets
  		this.calculateSimResults();
  		this.setTargets();
  		var degreeMax = parseInt(this.degreeSelect.getSelection()[0].getModel());
  		var progressive = true;
  		for (var i = degreeMax; i >= 0; i--) {
  			if (this.checkBetterFormation(units, i, progressive)) {
  				break;
  			}
  		}
  	}
  }
  catch(e) {
  	console.log(e);
  }
  	
  this.updateProWindow();
};
TASuite.main.prototype.optimizingDone = function() {
	this.buttonOptimize.setLabel("Optimize");
	this.battleResultsBox.setAllowClose(true);
	this.battleResultsBox.setModal(false);
	this.optimizing = false;
	this.ajaxImage.setVisibility("none");
	this.timerOn = false;
};
TASuite.main.prototype.updateFormation = function() {
	var units = this.getCityPreArmyUnits();
	this.restoreFormation(units.m_ArmyUnits.l);
	units.UpdateArmyLayout$0();
	units.RefreshData$0();
};
TASuite.main.prototype.checkBetterFormation = function(units, degree, progressive) {
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
  	if (i < (order.length - 1)) {
  		i++;
      var unit = units.m_ArmyUnits.l[order[i]];
  		var x = unit.get_CoordX();
  		var y = unit.get_CoordY();
  		
  		// TODO - Try breaking this up into multiple setTimeout() functions so that it won't be as laggy...
			loop1:
			for (var dx = degree; dx >= -degree; dx--) {
				for (var dy = degree; dy >= -degree; dy--) {
					if (!_this.optimizing) {
						break loop1;
					}
					// First check if this move is legal
					new_x = dx + x;
					new_y = dy + y;
					if (dy == 0 && dx == 0) {
						// Do nothing
					}
					else {
  					if (new_x >= 0 && new_x < 8) {
  						if (new_y >= 0 && new_y < 4) {
  							// Move the unit
  							//console.log("Moving the unit x: " + dx.toString() + " y: " + dy.toString());
  							// TODO - First, check if the unit is a different type or level
  							/*
  							var other_unit = units.GetUnitByCoord(new_x,new_y);
  							console.log(other_unit);
  							console.log(unit);
  							console.log(units);
  							*/
  							if (true) {
	  							unit.MoveBattleUnit(new_x, new_y);
	  							if (_this.checkNewResults(units, unit)) {
				    				_this.updateFormation();
				    				break loop1;
				    			}
				    			else if (progressive) unit.MoveBattleUnit(x, y);
				    		}
  						}
  					}
					}
				}
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
};
TASuite.main.prototype.setTargets = function() {
	var p = this.primarySelect.getSelection()[0].getModel();
	var s = this.secondarySelect.getSelection()[0].getModel();
	
	this.lastPrimary = this.getTarget(p);
	this.lastSecondary = this.getTarget(s);
	
	this.currentPrimary = this.lastPrimary;
	this.currentSecondary = this.lastSecondary;
};
TASuite.main.prototype.getTarget = function(v) {
	switch (v) {
		case 'DF':
			return this.lastDFPercentage;
		case 'CY':
			return this.lastCYPercentage;
		case 'TS':
			return this.lastPercentage;
		case 'ES':
			return this.lastEnemyPercentage;
	}
};
TASuite.main.prototype.compareTargets = function() {
	var np = 1;
	var ns = 1;
	var p = this.primarySelect.getSelection()[0].getModel();
	var s = this.secondarySelect.getSelection()[0].getModel();
	// Check if the primary should be negated
	switch (p) {
		case 'ES':
		case 'DF':
		case 'CY':
			np = -1;
			break;
	}
	switch (s) {
		case 'ES':
		case 'DF':
		case 'CY':
			ns = -1;
			break;
	}
	this.lastPrimary = this.getTarget(p);
	this.lastSecondary = this.getTarget(s);
	// Check if the primary is higher, if so, return true
	if ((this.lastPrimary * np) > (this.currentPrimary * np)) {
		//console.log("Primary " + (this.lastPrimary * np).toString() + " is better than " + (this.currentPrimary * np).toString());
		return true;
	}
	else {
		//console.log("Primary " + (this.lastPrimary * np).toString() + " is worse than " + (this.currentPrimary * np).toString());
		// Check if the primary is equal, if so, check the secondary
		if ((this.lastPrimary * np) == (this.currentPrimary * np)) {
			if ((this.lastSecondary * ns) > (this.currentSecondary * ns)) {
				// TODO - Figure out a better ratio, such as 1/2 the power of primary
				//console.log("Secondary " + (this.lastSecondary * ns).toString() + " is better than " + (this.currentSecondary * ns).toString());
				return true;
			}
			else {
				//console.log("Secondary " + (this.lastSecondary * ns).toString() + " is worse than " + (this.currentSecondary * ns).toString());
				return false;
			}
		}
		return false;
	}
};
TASuite.main.prototype.checkNewResults = function(units, unit) {
	this.calculateSimResults();
	
	if (this.compareTargets()) {
		this.saveFormation(units.m_ArmyUnits.l);
		this.setTargets();
		return true;
	}
	
	return false;
};
TASuite.main.prototype.restoreFormation = function(units) {
	for (var i = 0; (i < units.length); i++) {
		var saved_unit = this.saved_units[i];
		units[i].m_CoordX = saved_unit.x;
		units[i].m_CoordY = saved_unit.y;
		units[i].m_UnitId = saved_unit.id;
	}
};
TASuite.main.prototype.saveFormation = function(units) {
	this.saved_units = [];
	for (var i = 0; (i < units.length); i++) {
		var unit = units[i];
		var armyUnit = {};
		armyUnit.x = unit.m_CoordX;
		armyUnit.y = unit.m_CoordY;
		armyUnit.id = unit.m_UnitId;
		this.saved_units.push(armyUnit);
	}
};
TASuite.main.prototype.calculateTroopStrengths = function(battleground) {
	var total_hp = 0;
  var end_hp = 0;
  var e_total_hp = 0;
  var e_end_hp = 0;
  var eb_total_hp = 0;
  var eb_end_hp = 0;
  var eu_total_hp = 0;
  var eu_end_hp = 0;
  var i_total_hp = 0;
  var i_end_hp = 0;
  var v_total_hp = 0;
  var v_end_hp = 0;
  var a_total_hp = 0;
  var a_end_hp = 0;
  this.lastDFPercentage = 0;
  this.lastCYPercentage = 0;
  var entities = battleground.m_Entities.d;
  var attacker = SharedLib.Combat.ECbtAlignment.Attacker;
  for (var i in entities) {
  	var entity = entities[i];
  	var i_entity = entity.get_Entity$0();
	  if (i_entity.m_eAlignment == attacker) {
	  	// This is one of the good guys
	  	total_hp += i_entity.m_iHitpoints;
	  	end_hp += i_entity.m_iHitpointsCurrent;
	  	// TODO - Weight the percentage by the AP count for the unit (5, 10, 15, etc), as well as level of the unit
	  	if (entity.m_UnitType.AirUnit) {
	  		a_total_hp += i_entity.m_iHitpoints;
	  		a_end_hp += i_entity.m_iHitpointsCurrent;
	  	}
	  	else {
	  		if (entity.m_UnitType.MovementType == 1) {
	  			// Infantry
	  			i_total_hp += i_entity.m_iHitpoints;
	  			i_end_hp += i_entity.m_iHitpointsCurrent;
	  		}
	  		else {
	  			// Vehicle
	  			v_total_hp += i_entity.m_iHitpoints;
	  			v_end_hp += i_entity.m_iHitpointsCurrent;
	  		}
	  	}
	  }
	  else {
	  	// It is an enemy
	  	e_total_hp += i_entity.m_iHitpoints;
	  	e_end_hp += i_entity.m_iHitpointsCurrent;

	  	if (entity.m_Type == 1) {
	  		// Building
	  		eb_total_hp += i_entity.m_iHitpoints;
	  		eb_end_hp += i_entity.m_iHitpointsCurrent;
	  		
	  		if (i_entity.m_MDCTypeId == 195) {
		  		this.lastDFPercentage = (i_entity.m_iHitpointsCurrent / i_entity.m_iHitpoints) * 100;
		  	}
		  	if (i_entity.m_MDCTypeId == 177) {
		  		this.lastCYPercentage = (i_entity.m_iHitpointsCurrent / i_entity.m_iHitpoints) * 100;
		  	}
	  	}
	  	else {
	  		// Unit
	  		eu_total_hp += i_entity.m_iHitpoints;
	  		eu_end_hp += i_entity.m_iHitpointsCurrent;
	  	}
	  }
  }
  
	this.lastInfantryPercentage = (i_end_hp / i_total_hp) * 100;
	this.lastVehiclePercentage = (v_end_hp / v_total_hp) * 100;
	this.lastAirPercentage = (a_end_hp / a_total_hp) * 100;
	this.totalSeconds = (battleground.m_Simulation.m_iCombatStep * battleground.m_TimePerStep) / 1000;
  
  this.lastEnemyUnitsPercentage = (eu_end_hp / eu_total_hp) * 100;
  this.lastEnemyBuildingsPercentage = (eb_end_hp / eb_total_hp) * 100;
  this.lastEnemyPercentage = (e_end_hp / e_total_hp) * 100;
  this.lastPercentage = (end_hp / total_hp) * 100;
};
TASuite.main.prototype.onViewChange = function(oldMode, newMode) {
	// Close the pro window
	window.TASuite.main.getInstance().battleResultsBox.close();
};
TASuite.main.prototype.onUnitMoved = function(sender, e) {
	window.TASuite.main.getInstance().updateProWindow();
};
TASuite.main.prototype.onDamageDone = function(sender, e) {
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
};
TASuite.main.prototype.onDefenseDestroyed = function(sender, e) {
	// Try to update the Troop Strength meter
	try {
    battleground = sender.DamageDone.i[0].o;
    window.TASuite.main.getInstance().updateTroopStrength(battleground);
	}
  catch (e) {
  	console.log(e);
  }
};
TASuite.main.prototype.calculateSimResults = function() {
	var battleground = this.setupBattleground();
  
  // Run the simulation through 2000 steps
	while (battleground.m_Simulation.DoStep$0()) {
		
	}
	
  this.calculateTroopStrengths(battleground);
  
  this.lastVictory = battleground.m_Simulation.m_bDestroyDefense;
};
TASuite.main.prototype.updateProWindow = function() {
	this.calculateSimResults();
	
  if (this.lastVictory) {
  	this.simVictoryLabel.setValue("Yes");
  	this.simVictoryLabel.setTextColor("green");
  }
  else {
  	this.simVictoryLabel.setValue("No");
  	this.simVictoryLabel.setTextColor("red");
  }
  
  this.enemyUnitsStrengthLabel.setValue(this.lastEnemyUnitsPercentage.toFixed(2).toString());
  this.enemyBuildingsStrengthLabel.setValue(this.lastEnemyBuildingsPercentage.toFixed(2).toString());
  this.enemyTroopStrengthLabel.setValue(this.lastEnemyPercentage.toFixed(2).toString());
  this.airTroopStrengthLabel.setValue(this.lastAirPercentage.toFixed(2).toString());
  this.infantryTroopStrengthLabel.setValue(this.lastInfantryPercentage.toFixed(2).toString());
  this.vehicleTroopStrengthLabel.setValue(this.lastVehiclePercentage.toFixed(2).toString());
  this.CYTroopStrengthLabel.setValue(this.lastCYPercentage.toFixed(2).toString());
  this.DFTroopStrengthLabel.setValue(this.lastDFPercentage.toFixed(2).toString());
  this.simTimeLabel.setValue(this.totalSeconds.toFixed(2).toString());
  this.simTroopDamageLabel.setValue(this.lastPercentage.toFixed(2).toString());
  
};

TASuite.main.getInstance().battleResultsBox.close();
TASuite.main.getInstance().initializePro();
