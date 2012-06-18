TASuite.main.prototype.degree = null;
TASuite.main.prototype.currentDx = null;
TASuite.main.prototype.currentDy = null;
TASuite.main.prototype.currentUnit = null;
TASuite.main.prototype.units = null;
TASuite.main.prototype.units_list = null;

// Set the properties here
TASuite.main.prototype.buttonProTools = null;
TASuite.main.prototype.buttonOptimize = null;
TASuite.main.prototype.degreeSelect = null;
TASuite.main.prototype.primarySelect = null;
TASuite.main.prototype.secondarySelect = null;
TASuite.main.prototype.tertiarySelect = null;

TASuite.main.prototype.add_ArmyChanged = null;

TASuite.main.prototype.lastPrimary = null;
TASuite.main.prototype.lastSecondary = null;
TASuite.main.prototype.lastTertiary = null;
TASuite.main.prototype.currentPrimary = null;
TASuite.main.prototype.currentSecondary = null;
TASuite.main.prototype.currentTertiary = null;

TASuite.main.prototype.continuousCheckBox = null;

TASuite.main.prototype.lastPercentage = null;
TASuite.main.prototype.lastRepairTime = null;
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

TASuite.main.prototype.enemyTroopStrengthLabel = null;
TASuite.main.prototype.enemyBuildingsStrengthLabel = null;
TASuite.main.prototype.enemyUnitsStrengthLabel = null;
TASuite.main.prototype.airTroopStrengthLabel = null;
TASuite.main.prototype.infantryTroopStrengthLabel = null;
TASuite.main.prototype.vehicleTroopStrengthLabel = null;
TASuite.main.prototype.CYTroopStrengthLabel = null;
TASuite.main.prototype.DFTroopStrengthLabel = null;
TASuite.main.prototype.simTroopDamageLabel = null;
TASuite.main.prototype.simRepairTimeLabel = null;
TASuite.main.prototype.simVictoryLabel = null;
TASuite.main.prototype.simTimeLabel = null;
TASuite.main.prototype.found_improvement = null;

// Initialize the Pro mode
TASuite.main.prototype.initializePro = function() {
	_this = this;
	this.add_ArmyChanged = (new System.EventHandler).$ctor(this, this.onUnitMoved);
	
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
  this.battleResultsBox.moveTo(115, 150);
  this.battleResultsBox.setHeight(400);
  this.battleResultsBox.setWidth(200);
  this.battleResultsBox.getApplicationRoot().set({
	  blockerColor: '#000000',
	  blockerOpacity: 0.6
	});
	
	// The Help Vertical Box
  var pVBox = new qx.ui.container.Composite()
  pVBox.setLayout(new qx.ui.layout.VBox(5));
  pVBox.setThemedFont("bold");
	pVBox.setThemedPadding(2);
	pVBox.setThemedBackgroundColor("#eef");
	this.battleResultsBox.add(pVBox);
	var proHelpBar = new qx.ui.basic.Label().set({
    value: "<a target='_blank' href='http://www.youtube.com/watch?v=TcgryVL9jnk'>Tutorial</a> | <a target='_blank' href='http://www.moneyscripts.net/ta/faq'>FAQ</a> | <a target='_blank' href='http://userscripts.org/scripts/discuss/130344'>Forums</a>",
    rich : true
  });
  pVBox.add(proHelpBar);
	
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
	// The Repair Time Label
  var tHBox1 = new qx.ui.container.Composite();
  tHBox1.setLayout(new qx.ui.layout.HBox(5));
  tHBox1.add(new qx.ui.basic.Label("Repair Time: "));
  this.simRepairTimeLabel = new qx.ui.basic.Label("0");
	tHBox1.add(this.simRepairTimeLabel);
	this.simRepairTimeLabel.setTextColor("blue");
	tVBox.add(tHBox1);
	// The Troop Strength Label
	var tHBox5 = new qx.ui.container.Composite();
  tHBox5.setLayout(new qx.ui.layout.HBox(5));
  tHBox5.add(new qx.ui.basic.Label("Overall: "));
  this.simTroopDamageLabel = new qx.ui.basic.Label("100%");
	tHBox5.add(this.simTroopDamageLabel);
	this.simTroopDamageLabel.setTextColor("blue");
	tVBox.add(tHBox5);
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
	// Continuous Checkbox
	this.continuousCheckBox = new qx.ui.form.CheckBox('Continuous');
  vBox.add(this.continuousCheckBox);
	// Options for Optimize
	// Degree selector
	var hBox3 = new qx.ui.container.Composite()
  hBox3.setLayout(new qx.ui.layout.HBox(5));
  hBox3.add(new qx.ui.basic.Label("Mode: "));
	this.degreeSelect = new qx.ui.form.SelectBox();
	this.degreeSelect.add(new qx.ui.form.ListItem("Small", null, "1"));
	var averageChoice = new qx.ui.form.ListItem("Medium", null, "2");
	this.degreeSelect.add(averageChoice);
	this.degreeSelect.add(new qx.ui.form.ListItem("Large", null, "4"));
	this.degreeSelect.add(new qx.ui.form.ListItem("Full", null, "8"));
	this.degreeSelect.setSelection([averageChoice]);
	hBox3.add(this.degreeSelect);
	vBox.add(hBox3);
	// Primary selector
	var hBox4 = new qx.ui.container.Composite();
  hBox4.setLayout(new qx.ui.layout.HBox(5));
  hBox4.add(new qx.ui.basic.Label("1st: "));
	this.primarySelect = new qx.ui.form.SelectBox();
	var primarySelectDefault = new qx.ui.form.ListItem("C. Yard", null, "CY");
	this.primarySelect.add(primarySelectDefault);
	this.primarySelect.add(new qx.ui.form.ListItem("Repair Time", null, "RT"));
	this.primarySelect.add(new qx.ui.form.ListItem("Troop Strength", null, "TS"));
	this.primarySelect.add(new qx.ui.form.ListItem("Defense Facility", null, "DF"));
	this.primarySelect.add(new qx.ui.form.ListItem("Enemy Strength", null, "ES"));
	this.primarySelect.add(new qx.ui.form.ListItem("Battle Time", null, "BT"));
	this.primarySelect.setSelection([primarySelectDefault]);
	hBox4.add(this.primarySelect);
	vBox.add(hBox4);
	// Secondary selector
	var hBox5 = new qx.ui.container.Composite();
  hBox5.setLayout(new qx.ui.layout.HBox(5));
  hBox5.add(new qx.ui.basic.Label("2nd: "));
  this.lthbn = "0987654321"; // FIXME - The security check
	this.secondarySelect = new qx.ui.form.SelectBox();
	this.secondarySelect.add(new qx.ui.form.ListItem("C. Yard", null, "CY"));
	var secondarySelectDefault = new qx.ui.form.ListItem("Repair Time", null, "RT");
	this.secondarySelect.add(secondarySelectDefault);
	this.secondarySelect.add(new qx.ui.form.ListItem("Troop Strength", null, "TS"));
	this.secondarySelect.add(new qx.ui.form.ListItem("Defense Facility", null, "DF"));
	this.secondarySelect.add(new qx.ui.form.ListItem("Enemy Strength", null, "ES"));
	this.secondarySelect.add(new qx.ui.form.ListItem("Battle Time", null, "BT"));
	this.secondarySelect.setSelection([secondarySelectDefault]);
	hBox5.add(this.secondarySelect);
	vBox.add(hBox5);
	// Tertiary selector
	var hBox6 = new qx.ui.container.Composite();
  hBox6.setLayout(new qx.ui.layout.HBox(5));
  hBox6.add(new qx.ui.basic.Label("3rd: "));
	this.tertiarySelect = new qx.ui.form.SelectBox();
	this.tertiarySelect.add(new qx.ui.form.ListItem("C. Yard", null, "CY"));
	this.tertiarySelect.add(new qx.ui.form.ListItem("Repair Time", null, "RT"));
	this.tertiarySelect.add(new qx.ui.form.ListItem("Troop Strength", null, "TS"));
	this.tertiarySelect.add(new qx.ui.form.ListItem("Defense Facility", null, "DF"));
	var tertiarySelectDefault = new qx.ui.form.ListItem("Enemy Strength", null, "ES");
	this.tertiarySelect.add(tertiarySelectDefault);
	this.tertiarySelect.add(new qx.ui.form.ListItem("Battle Time", null, "BT"));
	this.tertiarySelect.setSelection([tertiarySelectDefault]);
	hBox6.add(this.tertiarySelect);
	vBox.add(hBox6);
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
TASuite.main.prototype.closeProBox = function() {
	try {
		var units = this.getCityPreArmyUnits();
		if (units) {
			units.remove_ArmyChanged(this.add_ArmyChanged);
		}
		this.battleResultsBox.close();
	}
	catch(e) {
		console.log(e);
	}
};
TASuite.main.prototype.togglePro = function() {
	var units = this.getCityPreArmyUnits();
	this.units = units.m_ArmyUnits.l;
	if (this.battleResultsBox.isVisible()) {
		this.closeProBox();
	}
	else {
		// Add the event listener for armybar
    try {
    	units.add_ArmyChanged(this.add_ArmyChanged);
    }
    catch (e) {
    	console.log(e);
    }
    
    /*
    var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
    setup_units = own_city.m_CityArmyFormationsManager.m_ArmyFormations.d[own_city.m_CityArmyFormationsManager.m_CurrentTargetBaseId];
    
    units.m_ArmyUnits = setup_units.m_ArmyUnits;
    
    units.RefreshData$0();
    units.UpdateArmyLayout$0();
    units.UpdateFormation();
    */
    
		this.updateProWindow();
		this.battleResultsBox.moveTo(115, 150);
	  this.battleResultsBox.setHeight(400);
	  this.battleResultsBox.setWidth(200);
		this.battleResultsBox.open();
	}
};

TASuite.main.prototype.optimizeLayout = function() {
	try {
		// First, get the CityPreArmyUnits
  	var units = this.getCityPreArmyUnits();
		if (this.optimizing) {
			this.optimizingDone(false);
			this.updateFormation();
		}
		else if (ClientLib.Data.MainData.GetInstance().m_Player.name == this.lthbn) {
  		this.battleResultsBox.setModal(true);
  		this.battleResultsBox.setAllowClose(false);
  		this.buttonOptimize.setLabel("Cancel");
  		this.ajaxImage.setVisibility("visible");
  		this.optimizing = true;
  		// Set the current primary and secondary targets
  		this.updateProWindow();
  		this.setTargets();
  		this.degree = parseInt(this.degreeSelect.getSelection()[0].getModel());
  		this.found_improvement = false;
  		this.checkBetterFormation();
  	}
  }
  catch(e) {
  	console.log(e);
  }
};
TASuite.main.prototype.optimizingDone = function(continuous) {
	if (continuous == null) {
		continuous = this.continuousCheckBox.getValue();
	}
	if (continuous && this.found_improvement) {
		this.optimizing = false;
		this.optimizeLayout();
	}
	else {
		this.buttonOptimize.setLabel("Optimize");
		this.battleResultsBox.setAllowClose(true);
		this.battleResultsBox.setModal(false);
		this.optimizing = false;
		this.ajaxImage.setVisibility("none");
	}
};
TASuite.main.prototype.updateFormation = function() {
	var units = this.getCityPreArmyUnits();
	this.restoreFormation(units.m_ArmyUnits.l);
	units.UpdateArmyLayout$0();
	units.RefreshData$0();
};
TASuite.main.prototype.checkBetterFormation = function() {
	this.saveFormation();
	
	var order = [];
	for (var i = 0; i < this.units.length; i++){
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
  
  this.units_list = order;
	this.currentUnit = this.units[this.units_list.pop()];
	this.currentDx = this.degree;
	this.currentDy = this.degree;
	setTimeout(this.moveLoop, 1000);
	
	return false;
};
TASuite.main.prototype.moveLoop = function() {
	//console.log("Start of moveLoop");
	ta = window.TASuite.main.getInstance();
	if (!ta.optimizing) {
		//console.log("No longer optimizing.");
		return;
	}
	// First check if this move is legal
	var unit = ta.currentUnit;
	var x = unit.get_CoordX();
  var y = unit.get_CoordY();
	var degree = ta.degree;
	var dx = ta.currentDx;
	var dy = ta.currentDy;
	dx -= 1;
	
	new_x = dx + x;
	new_y = dy + y;
	if (dy == 0 && dx == 0) {
		dx -= 1;
	}
	else {
		if (new_x >= 0 && new_x < 8) {
			if (new_y >= 0 && new_y < 4) {
				// Move the unit
				//console.log("Moving the unit x: " + new_x.toString() + " y: " + new_y.toString());
				// TODO - First, check if the unit is a different type or level
				/*
				var other_unit = units.GetUnitByCoord(new_x,new_y);
				console.log(other_unit);
				console.log(unit);
				console.log(units);
				*/
				unit.MoveBattleUnit(new_x, new_y);
				if (ta.checkNewResults()) {
  				ta.updateFormation();
  				ta.nextUnit();
  				return;
  			}
  			else {
  				unit.MoveBattleUnit(x, y);
  			}
			}
		}
	}
	
	if (dx < -degree || dx < 0) {
		dx = degree;
		dy -= 1;
		if (dy < -degree || dy < 0) {
			ta.nextUnit();
			return;
		}
	}
	
	// If we are still on this unit, then set the dx and dy and schedule another iteration
	ta.currentDx = dx;
	ta.currentDy = dy;
	setTimeout(ta.moveLoop, 10);
	//console.log("End of moveLoop");
};
TASuite.main.prototype.nextUnit = function() {
	// Set the next unit if this isn't the last one, and start the loop again
	if (this.units_list.length > 0) {
		//console.log("Going to next unit");
		this.currentDx = this.degree;
		this.currentDy = this.degree;
		this.currentUnit = this.units[this.units_list.pop()];
		setTimeout(this.moveLoop, 10);
	}
	else {
		// Subtract the degree and start over
		this.degree -= 1;
		if (this.degree > 0) {
			//console.log("Moving to next degree");
			this.checkBetterFormation();
		}
		else {
			//console.log("Done Optimizing");
			this.optimizingDone();
			this.updateFormation();
		}
	}
}
TASuite.main.prototype.setTargets = function() {
	//console.log("Setting the targets");
	var p = this.primarySelect.getSelection()[0].getModel();
	var s = this.secondarySelect.getSelection()[0].getModel();
	var t = this.tertiarySelect.getSelection()[0].getModel();
	
	this.lastPrimary = this.getTarget(p);
	this.lastSecondary = this.getTarget(s);
	this.lastTertiary = this.getTarget(t);
	
	this.currentPrimary = this.lastPrimary;
	this.currentSecondary = this.lastSecondary;
	this.currentTertiary = this.lastTertiary;
};
TASuite.main.prototype.getTarget = function(key) {
	switch (key) {
		case 'DF':
			return this.lastDFPercentage;
		case 'CY':
			return this.lastCYPercentage;
		case 'RT':
			return this.lastRepairTime;
		case 'TS':
			return this.lastPercentage;
		case 'ES':
			return this.lastEnemyPercentage;
		case 'BT':
			return this.totalSeconds;
	}
};
TASuite.main.prototype.compareTargets = function() {
	var np = 1;
	var ns = 1;
	var nt = 1;
	var p = this.primarySelect.getSelection()[0].getModel();
	var s = this.secondarySelect.getSelection()[0].getModel();
	var t = this.tertiarySelect.getSelection()[0].getModel();
	// Check if the primary should be negated
	switch (p) {
		case 'ES':
		case 'DF':
		case 'CY':
		case 'RT':
		case 'BT':
			np = -1;
			break;
	}
	switch (s) {
		case 'ES':
		case 'DF':
		case 'CY':
		case 'RT':
		case 'BT':
			ns = -1;
			break;
	}
	switch (t) {
		case 'ES':
		case 'DF':
		case 'CY':
		case 'RT':
		case 'BT':
			nt = -1;
			break;
	}
	this.lastPrimary = this.getTarget(p);
	this.lastSecondary = this.getTarget(s);
	this.lastTertiary = this.getTarget(t);
	// Check if the primary is higher, if so, return true
	if ((this.lastPrimary * np) > (this.currentPrimary * np)) {
		//console.log("Primary " + (this.lastPrimary * np).toString() + " is better than " + (this.currentPrimary * np).toString());
		return true;
	}
	else if ((this.lastPrimary * np) == (this.currentPrimary * np)) {
		//console.log("Primary " + (this.lastPrimary * np).toString() + " is worse than " + (this.currentPrimary * np).toString());
		// Check if the primary is equal, if so, check the secondary
		if ((this.lastSecondary * ns) > (this.currentSecondary * ns)) {
			//console.log("Secondary " + (this.lastSecondary * ns).toString() + " is better than " + (this.currentSecondary * ns).toString());
			return true;
		}
		else if ((this.lastSecondary * ns) == (this.currentSecondary * ns)) {
			if ((this.lastTertiary * nt) > (this.currentTertiary * nt)) {
				return true;
			}
		}
	}
	
	return false;
};
TASuite.main.prototype.checkNewResults = function() {
	this.calculateSimResults();
	
	if (this.compareTargets()) {
		this.found_improvement = true;
		this.saveFormation();
		this.setTargets();
		this.updateProWindow();
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
TASuite.main.prototype.saveFormation = function() {
	this.saved_units = [];
	for (var i = 0; (i < this.units.length); i++) {
		var unit = this.units[i];
		var armyUnit = {};
		armyUnit.x = unit.m_CoordX;
		armyUnit.y = unit.m_CoordY;
		armyUnit.id = unit.m_UnitId;
		this.saved_units.push(armyUnit);
	}
};
TASuite.main.prototype.calculateTroopStrengths = function(battleground) {
	//console.log("Calculating Troop Strengths");
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
  
  // TODO - Get the x,y position of the enemy CY and DF, so we can add new metric for building in front of them
  
  for (var i in entities) {
  	var entity = entities[i];
  	var i_entity = entity.get_Entity$0();
	  if (i_entity.m_eAlignment == attacker) {
	  	// This is one of the good guys
	  	total_hp += i_entity.m_iHitpoints;
	  	end_hp += i_entity.m_iHitpointsCurrent;
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
	  		
	  		var unitType = ClientLib.Res.ResMain.GetInstance$10().get_Gamedata$0().units[i_entity.m_MDCTypeId].dnuc;  
        if (unitType == 'DEFENSE FACILITY') {  
            this.lastDFPercentage = (i_entity.m_iHitpointsCurrent / i_entity.m_iHitpoints) * 100;  
        } 
        else if (unitType == 'CONSTRUCTION YARD') {  
            this.lastCYPercentage = (i_entity.m_iHitpointsCurrent / i_entity.m_iHitpoints) * 100;  
        };
	  	}
	  	else {
	  		// Unit
	  		eu_total_hp += i_entity.m_iHitpoints;
	  		eu_end_hp += i_entity.m_iHitpointsCurrent;
	  	}
	  }
  }
  
	this.lastInfantryPercentage = i_total_hp ? (i_end_hp / i_total_hp) * 100 : 100;
	this.lastVehiclePercentage = v_total_hp ? (v_end_hp / v_total_hp) * 100 : 100;
	this.lastAirPercentage = a_total_hp ? (a_end_hp / a_total_hp) * 100 : 100;
	this.totalSeconds = (battleground.m_Simulation.m_iCombatStep * battleground.m_TimePerStep) / 1000;
  
  this.lastEnemyUnitsPercentage = (eu_end_hp / eu_total_hp) * 100;
  this.lastEnemyBuildingsPercentage = (eb_end_hp / eb_total_hp) * 100;
  this.lastEnemyPercentage = (e_end_hp / e_total_hp) * 100;
  this.lastPercentage = (end_hp / total_hp) * 100;
  
  // Calculate the repair time
  var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
  var crd = own_city.get_CityRepairData();
  var repair_times = own_city.m_CityUnits.m_FullRawRepairTimeForUnitGroupTypes.d;
  var r_types = ClientLib.Base.EResourceType;
	var i_repair_time = crd.ConvertRepairCost$0(r_types.RepairChargeInf, repair_times[ClientLib.Data.EUnitGroup.Infantry], (1 - this.lastInfantryPercentage / 100));
	var a_repair_time = crd.ConvertRepairCost$0(r_types.RepairChargeAir, repair_times[ClientLib.Data.EUnitGroup.Aircraft], (1 - this.lastAirPercentage / 100));
	var v_repair_time = crd.ConvertRepairCost$0(r_types.RepairChargeVeh, repair_times[ClientLib.Data.EUnitGroup.Vehicle], (1 - this.lastVehiclePercentage / 100));
	this.lastRepairTime = Math.max(v_repair_time, a_repair_time, i_repair_time);
};
TASuite.main.prototype.onViewChange = function(oldMode, newMode) {
	// Close the pro window
	window.TASuite.main.getInstance().closeProBox();
};
TASuite.main.prototype.onUnitMoved = function(sender, e) {
	if (!this.optimizing) {
		window.TASuite.main.getInstance().updateProWindow();
	}
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
	var battleground = this.setupBattleground(this.getCityPreArmyUnits());
  
  // Run the simulation until it's done
	while (battleground.m_Simulation.DoStep$0(false)) {	}
	
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
  
  // Calculate the Repair time in seconds
  this.simRepairTimeLabel.setValue(this.formatSecondsAsTime(this.lastRepairTime, "h:mm:ss"));
  this.simTroopDamageLabel.setValue(this.lastPercentage.toFixed(2).toString());
};

TASuite.main.prototype.formatSecondsAsTime = function(secs, format) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if (hr < 10)   { hr    = "0" + hr; }
  if (min < 10) { min = "0" + min; }
  if (sec < 10)  { sec  = "0" + sec; }

  if (format != null) {
    var formatted_time = format.replace('hh', hr);
    formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
    formatted_time = formatted_time.replace('mm', min);
    formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
    formatted_time = formatted_time.replace('ss', sec);
    formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
    return formatted_time;
  } 
  else {
    return hr + ':' + min + ':' + sec;
  }
}

TASuite.main.getInstance().battleResultsBox.close();
TASuite.main.getInstance().initializePro();
