var vmModule = require("./main-view-model");
var theLabel = null;
var pickerData = [];

var PickerDelegate = UIResponder.extend({
    numberOfComponentsInPickerView: function(pickerView) {
        return 1;
    },
    pickerViewNumberOfRowsInComponent: function(pickerView, component){
        return pickerData.length;
    },
    pickerViewTitleForRowForComponent: function(pickerView, row, component) {
        return pickerData[row];
    },
    pickerViewDidSelectRowInComponent: function(pickerView, row, component) {
        var font = pickerData[row];
        //
        theLabel.ios.font = UIFont.fontWithNameSize(font, 30);
        theLabel._ios.adjustsFontSizeToFitWidth = true;
        theLabel._ios.sizeToFit();
        theLabel._ios.frame = CGRectMake(theLabel._ios.frame.origin.x, 
                                         theLabel._ios.frame.origin.y, 
                                         200, 
                                         theLabel._ios.frame.size.height);
        theLabel._ios.center = theLabel.parent._view.center;
    },
    pickerViewViewForRowForComponentReusingView: function(pickerView, row, component, view) {
        var font = pickerData[row];
        
        var lbl = UILabel.alloc().init();
        lbl.text = font;
        lbl.font = UIFont.fontWithNameSize(font, 20);
        lbl.textColor = UIColor.whiteColor();
        return lbl;
    }

}, {
    name: "PickerDelegate",
    protocols: [UIPickerViewDataSource, UIPickerViewDelegate]
});

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}

var pickerDelegate = new PickerDelegate();

function getFonts() {
    var retFonts = [];
    
    var familyNames = UIFont.familyNames();
    for (var i = 0; i < familyNames.count; ++i) {
        var famName = familyNames[i];
        var fontNamesForFamily = UIFont.fontNamesForFamilyName(famName);
        for (var k = 0; k < fontNamesForFamily.count; ++k) {
            var fontName = fontNamesForFamily[k];
            retFonts.push(fontName);
        }
    }
    return retFonts.sort();
}

function populateFonts() {
    var fonts = getFonts();
    for (var i = 0; i < fonts.length; i++) {
        pickerData.push(fonts[i]);
    }
}

function layoutLoaded(args) {
    populateFonts();
    
    var theView = args.object._view;
    
    var picker = UIPickerView.alloc().init();
    picker.dataSource = pickerDelegate;
    picker.delegate = pickerDelegate;
    
    args.object.ios.addSubview(picker);
}

function labelLoaded(args) {
    theLabel = args.object;
}

exports.pageLoaded = pageLoaded;
exports.layoutLoaded = layoutLoaded;
exports.labelLoaded = labelLoaded;