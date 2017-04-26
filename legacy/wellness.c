// Wellness Calculation Program
// Written by Lieutenant Steven DeLoach
// Altamonte Springs Police Department
// sfdeloach@altamonte.org
// September/October 2013

// Program notes:
// The input table is based on the assumption that there are 21 input columns
// (column 0 thru 20) labeled as such:
//   col 0  - Is this row to be included in the report?  Will only process the
//            row if 'y' or 'Y' is entered, all other input is ignored
//   col 1  - Last name
//   col 2  - First name
//   col 3  - ID number
//   col 4  - Gender
//   col 5  - Date of birth
//   col 6  - Age, this can be calculated by a formula in the input worksheet using cols 5 and 7
//   col 7  - Date of test
//   col 8  - Resting heart rate
//   col 9  - Resting blood pressure
//   col 10 - Weight
//   col 11 - Body fat
//   col 12 - Flexibility
//   col 13 - Sit ups
//   col 14 - Bench press
//   col 15 - Leg press
//   col 16 - Run, minutes, if the character '*' is encountered, then the walk
//            will be used for calculations
//   col 17 - Run, seconds, ibid
//   col 18 - Walk, minutes
//   col 19 - Walk, seconds
//   col 20 - Walk, heart rate

#include<stdio.h>
#include<stdlib.h>
#include<string.h>

/* FUNCTION PROTOTYPES *////////////////////////////////////////////////////////

char* grabInput(int, int, char *, char *);   // returns a string from a position in the input file
                                             // input 1: row
                                             // input 2: column
                                             // input 3: the string located at row, column
                                             // input 4: name of the input file to be opened
void  createPath(char *, char *, int, char); // writes the path to files in 'tables' directory
float interpol(float, char *, int);          // looks at the appropriate table and interpolates
                                             // if int = 0, the table is inverse related
                                             // if int = 1, the table is direct related
float readTable(FILE *);                     // used by the function interpol
int   rowCount(FILE *);
void  changeExtension(char *, char *);
void  generateHTMLheader(FILE *, char *, char *);
void  printTableHeader(FILE *);

/* MAIN FUNCTION *//////////////////////////////////////////////////////////////

int main(void) {
    FILE  *dataFile;   // points to the input file created by a spreadsheet
    FILE  *reportFile; // points to the generated report file
    char  gender;
    char  evenOdd = 'O'; // used to shade the even numbered rows in the html report
    char  tablePath[] = "tables//xxxx_x_x.dat";
    char  reportPath[50] = "reports//";
    char  inputPath[50] = "input//";
    char  inputFileName[50];
    char  string_val[50]; // holds the string read from the input file, also, this
                         // is the variable returned by the function grabInput
    char  reportTitle[100];
    char  author[100];
    int   title; // used for the creation of opening screen
    int   age, weight;
    int   row; // variable used to locate the correct row in the input file
    int   rowTotal;
    int   runFlag; // if == 1, run option, if == 0, walk option
    int   failFlag; // flag == 1 if any component scores less than 50%
    float xBody, yBody, xFlex, yFlex, xSitx, ySitx, xBenc, yBenc;
    float xLegx, yLegx, xRunx_min, xRunx_sec, xRunx, yRunx;
    float xVo2x, gVo2x, hrVo2x, timeVo2x_min, timeVo2x_sec, timeVo2x, yVo2x;
    float finalAve;
    float aveBody, aveFlex, aveSitx, aveBenc, aveLegx, aveRunx, aveVo2x;
    float aveFinl;
    int   totPart, totVo2x, totRunx;
    
    // gather information to start the report process
    putchar('\n');
    putchar(201);
    for(title = 0; title < 27; title++) putchar(205);
    putchar(187);
    putchar('\n');
    putchar(186);
    for(title = 0; title < 27; title++) putchar(' ');
    putchar(186);
    putchar('\n');
    putchar(186);
    printf(" Wellness Report Generator ");
    putchar(186);
    putchar('\n');
    putchar(186);
    for(title = 0; title < 27; title++) putchar(' ');
    putchar(186);
    putchar('\n');
    putchar(200);
    for(title = 0; title < 27; title++) putchar(205);
    putchar(188);
    putchar('\n');
    putchar('\n');
    printf("Enter title: ");
    gets(reportTitle);
    printf(" Created by: ");
    gets(author);    
    printf(" Enter file: ");
    gets(inputFileName);
    
    // open and count the number of records that need to be processed
    strcat(inputPath, inputFileName);  // creates full path to input file
    dataFile = fopen(inputPath,"r");
    if(dataFile == NULL) {
        printf("Error---Input file not found...\n");
        printf("Early Termination...\nNo report was generated...\n");
        printf("\n\nCheck the name of the input file you entered and try again...");
        printf("\nPress the Enter key to exit...\n");
        getchar();
        return 0;
    } else printf("Input file successfully opened...\n");
    rowTotal = rowCount(dataFile);
    printf("Total number of records to process: %d\n", rowTotal - 1);
    fclose(dataFile);
    printf("Input file closed...\n");

    // create the html file that will hold the results
    changeExtension(inputFileName, "htm"); // changes the extension to .htm
    strcat(reportPath, inputFileName); // creates full path to report file
    reportFile = fopen(reportPath,"w");
    if(reportFile == NULL) {
        printf("Error---Report file not created...\n");
    } else printf("Report file successfully created...\n");    
    generateHTMLheader(reportFile, reportTitle, author);
    printf("HTML header written to report file...\n");

    // initialize the variable that will hold all of the y-scores to be later
    // used to calculate overall averages of all assessments
    
    aveBody = 0.0;
    aveFlex = 0.0;
    aveSitx = 0.0;
    aveBenc = 0.0;
    aveLegx = 0.0;
    aveRunx = 0.0;
    aveVo2x = 0.0;
    aveFinl = 0.0;
    totPart = 0;
    totRunx = 0;
    totVo2x = 0;
    
    // start of the main loop that is cycled for each officer    
    printf("Calculating results for each officer...\n");
    for(row = 1; row < rowTotal; row++) {
      if(*grabInput(row, 0, string_val, inputPath) == 'Y') {
        failFlag = 0; // reset the failFlag
        totPart++;    // update the total of participants
        age    = atoi(grabInput(row, 6, string_val, inputPath));
        gender = *(grabInput(row, 4, string_val, inputPath));
        weight = atoi(grabInput(row, 10, string_val, inputPath));

        // body fat calculation
        xBody = atof(grabInput(row, 11, string_val, inputPath));
        createPath(tablePath, "body", age, gender);
        yBody = interpol(xBody, tablePath, 0);
        if(yBody < 0.50) failFlag = 1;
        aveBody = aveBody + yBody;

        // flex calculation
        xFlex = atof(grabInput(row, 12, string_val, inputPath));
        createPath(tablePath, "flex", age, gender);    
        yFlex = interpol(xFlex, tablePath, 1);
        if(yFlex < 0.50) failFlag = 1;
        aveFlex = aveFlex + yFlex;

        // sit ups calculation
        xSitx = atof(grabInput(row, 13, string_val, inputPath));
        createPath(tablePath, "sitx", age, gender);    
        ySitx = interpol(xSitx, tablePath, 1);
        if(ySitx < 0.50) failFlag = 1;
        aveSitx = aveSitx + ySitx;
        
        // bench press calculation
        xBenc = atof(grabInput(row, 14, string_val, inputPath));
        createPath(tablePath, "benc", age, gender);    
        yBenc = interpol(xBenc/weight, tablePath, 1);
        if(yBenc < 0.50) failFlag = 1;
        aveBenc = aveBenc + yBenc;

        // leg press calculation
        xLegx = atof(grabInput(row, 15, string_val, inputPath));
        createPath(tablePath, "legx", age, gender);    
        yLegx = interpol(xLegx/weight, tablePath, 1);
        if(yLegx < 0.50) failFlag = 1;
        aveLegx = aveLegx + yLegx;

        // running and final average calculation
        if (*(grabInput(row, 16, string_val, inputPath) + 0) != '*') {
            runFlag = 1;
            xRunx_min = atof(grabInput(row, 16, string_val, inputPath));
            xRunx_sec = atof(grabInput(row, 17, string_val, inputPath));
            xRunx     = xRunx_min + xRunx_sec/60.0;
            createPath(tablePath, "runx", age, gender);    
            yRunx = interpol(xRunx, tablePath, 0);
            if(yRunx < 0.50) failFlag = 1;
            totRunx++;
            aveRunx = aveRunx + yRunx;
        
            finalAve = (yBody + yFlex + ySitx + yBenc + yLegx + yRunx) / 6.0;
        }

        // walking and final average calculation
        else {
            runFlag = 0;
            hrVo2x   = atoi(grabInput(row, 20, string_val, inputPath));
            timeVo2x_min = atof(grabInput(row, 18, string_val, inputPath));
            timeVo2x_sec = atof(grabInput(row, 19, string_val, inputPath));
            timeVo2x     = timeVo2x_min + timeVo2x_sec/60.0;
            if(gender == 'M' || gender == 'm') gVo2x = 1;
            else gVo2x = 0;        
            xVo2x = 132.853 - 0.0769*weight - 0.3877*age + 6.3150*gVo2x - 3.2649*timeVo2x - 0.1565*hrVo2x;
            createPath(tablePath, "vo2x", age, gender);
            yVo2x = interpol(xVo2x, tablePath, 1);
            if(yVo2x < 0.50) failFlag = 1;
            totVo2x++;
            aveVo2x = aveVo2x + yVo2x;            
        
            finalAve = (yBody + yFlex + ySitx + yBenc + yLegx + yVo2x) / 6.0;
        }
        
        // update the overall averages for the end of the report
        aveFinl = aveFinl + finalAve;

        // print the results    
        if(failFlag) {
            fprintf(reportFile, "<tr class=fail><td>%s</td>", grabInput(row, 1, string_val, inputPath));
        }
        else fprintf(reportFile, "<tr class=%c><td>%s</td>", evenOdd, grabInput(row, 1, string_val, inputPath));
        if(evenOdd == 'O') evenOdd = 'E';
        else evenOdd = 'O';
        printf("%s...", grabInput(row, 1, string_val, inputPath));
        fprintf(reportFile, "<td>%s</td>", grabInput(row, 2, string_val, inputPath));
        fprintf(reportFile, "<td>%.1f</td>", finalAve * 100.0);
        printf("%.1f%%", finalAve * 100.0);
        if(failFlag) printf("   <---FAILED AN ASSESSMENT\n");
        else printf("\n");
        fprintf(reportFile, "<td>%s</td>", grabInput(row, 8, string_val, inputPath));
        fprintf(reportFile, "<td>%s</td>", grabInput(row, 9, string_val, inputPath));
        fprintf(reportFile, "<td>%s</td>", grabInput(row, 10, string_val, inputPath));
        fprintf(reportFile, "<td>%s</td>", grabInput(row, 6, string_val, inputPath));
        fprintf(reportFile, "<td>%.1f</td>", xBody);
        fprintf(reportFile, "<td>%.1f</td>", yBody * 100.0);
        fprintf(reportFile, "<td>%.1f</td>", xFlex);
        fprintf(reportFile, "<td>%.1f</td>", yFlex * 100.0);
        fprintf(reportFile, "<td>%.0f</td>", xSitx);
        fprintf(reportFile, "<td>%.1f</td>", ySitx * 100.0);
        fprintf(reportFile, "<td>%.0f</td>", xBenc);
        fprintf(reportFile, "<td>%.1f</td>", yBenc * 100.0);
        fprintf(reportFile, "<td>%.0f</td>", xLegx);
        fprintf(reportFile, "<td>%.1f</td>", yLegx * 100.0);
        if (runFlag == 1) {
            fprintf(reportFile, "<td>Run</td>");
            if(xRunx_sec < 10.0) fprintf(reportFile, "<td>%.0f:0%.0f</td>", xRunx_min, xRunx_sec);
            else fprintf(reportFile, "<td>%.0f:%.0f</td>", xRunx_min, xRunx_sec);
            fprintf(reportFile, "<td>*</td>");
            fprintf(reportFile, "<td>%.1f</td></tr>\n", yRunx * 100.0);
        }
        else {
            fprintf(reportFile, "<td>Walk</td>");
            if(timeVo2x_sec < 10.0) fprintf(reportFile, "<td>%.0f:0%.0f</td>", timeVo2x_min, timeVo2x_sec);
            else fprintf(reportFile, "<td>%.0f:%.0f</td>", timeVo2x_min, timeVo2x_sec);
            fprintf(reportFile, "<td>%d</td>", (int)hrVo2x);
            fprintf(reportFile, "<td>%.1f</td></tr>\n", yVo2x * 100.0);
        }
      }
    }
    fprintf(reportFile, "</tbody></table>\n");
    
    // print the overall averages at the bottom of report file
    fprintf(reportFile, "<body><hr /><b>Overall Report Averages</b></body><ul>");
    
    if(totPart == 0) {
      fprintf(reportFile, "<li>Body Composition - n/a</li>");
      fprintf(reportFile, "<li>Flexibility - n/a</li>");
      fprintf(reportFile, "<li>Sit Ups - n/a</li>");
      fprintf(reportFile, "<li>Bench Press - n/a</li>");
      fprintf(reportFile, "<li>Leg Press - n/a</li>");
    }
    else {
      fprintf(reportFile, "<li>Body Composition - %.1f%%</li>", (100*aveBody)/totPart);
      fprintf(reportFile, "<li>Flexibility - %.1f%%</li>", (100*aveFlex)/totPart);
      fprintf(reportFile, "<li>Sit Ups - %.1f%%</li>", (100*aveSitx)/totPart);
      fprintf(reportFile, "<li>Bench Press - %.1f%%</li>", (100*aveBenc)/totPart);
      fprintf(reportFile, "<li>Leg Press - %.1f%%</li>", (100*aveLegx)/totPart);
    }

    if(totRunx == 0) fprintf(reportFile, "<li>1.5-mile Run - n/a</li>");
    else fprintf(reportFile, "<li>1.5-mile Run - %.1f%%</li>", (100*aveRunx)/totRunx);
    
    if(totVo2x == 0) fprintf(reportFile, "<li>1-mile Walk - n/a</li>");
    else fprintf(reportFile, "<li>1-mile Walk - %.1f%%</li>", (100*aveVo2x)/totVo2x);
    
    if(totPart == 0) fprintf(reportFile, "<li>Overall Score - n/a</li>");
    else fprintf(reportFile, "<li>Overall Score - %.1f%%</li>", (100*aveFinl)/totPart);
    
    fprintf(reportFile, "<li>Total Participants - %d</li>", totPart);
    
    fprintf(reportFile, "\n</ul></html>\n");
    
    fclose(reportFile);
    printf("\nTotal Participants - %d\n", totPart);
    printf("\nProgram complete, look for results in 'reports' directory...\n\n");
    printf("\nPress the 'Enter' key to exit....");
    getchar();
    return 0;
}

/* FUNCTION DEFINITIONS *///////////////////////////////////////////////////////

void generateHTMLheader(FILE *reportFile, char *reportTitle, char *author) {
    fprintf(reportFile, "<html><head><title>%s</title>\n", reportTitle);
    fprintf(reportFile, "<style>body {font-family: Arial, sans-serif;}"
                        "table { border-collapse:collapse;            "
                        "        page-break-inside:auto}              "
                        "tr { page-break-inside:avoid;                "
                        "     page-break-after:auto}                  "
                        "thead {display:table-header-group}           "
                        "th { font-size:90%%;                         "
                        "     text-align:center;                      "
                        "     vertical-align:middle;                  "
                        "     padding:4px;                            "
                        "     border-style:solid;                     "
                        "     border-width:1px;                       "
                        "     border-color:black;                     "
                        "     background-color:#545454;               "
                        "     color:#E9E9E9;}                         "
                        "td { font-size:90%%;                         "
                        "     text-align:center;                      "
                        "     vertical-align:middle;                  "
                        "     padding:4px;                            "
                        "     border-style:solid;                     "
                        "     border-width:1px;                       "
                        "     border-color:black;                     "
                        "     background-color:white;                 "
                        "     color:black;}                           "
                        "tr.E td {background-color:#D2D2FF;}          "
                        "tr.fail td {background-color:#DA4747;}       "
                        "</style></head>\n");
    fprintf(reportFile, "<h3>ALTAMONTE SPRINGS POLICE DEPARTMENT - Physical Fitness Test Results</h3>\n");
    fprintf(reportFile, "<h4>%s - report completed by %s</h4>\n", reportTitle, author);

    printTableHeader(reportFile);
}

void printTableHeader(FILE *reportFile) {
    fprintf(reportFile, "<table><thead><tr><th colspan=\"2\">NAME</th>"
                        "<th rowspan=\"2\">AVERAGE</th>               "
                        "<th colspan=\"2\">RESTING</th>               "
                        "<th colspan=\"2\">TEST</th>                  "
                        "<th colspan=\"2\">BODY COMP</th>             "
                        "<th colspan=\"2\">BODY FLEX</th>             "
                        "<th colspan=\"2\">SIT UPS</th>               "
                        "<th colspan=\"2\">BENCH PRESS</th>           "
                        "<th colspan=\"2\">LEG PRESS</th>             "
                        "<th colspan=\"4\">RUN OR WALK</th>           "
                        "<tr><th>Last</th>                            "
                        "<th>First</th>                               "
                        "<th>Heart Rate</th>                          "
                        "<th>Blood Pressure</th>                      "
                        "<th>Weight</th>                              "
                        "<th>Age</th>                                 "
                        "<th>#</th><th>%%</th><th>#</th><th>%%</th>   "
                        "<th>#</th><th>%%</th><th>#</th><th>%%</th>   "
                        "<th>#</th><th>%%</th>                        "
                        "<th>Option</th>                              "
                        "<th>Time</th>                                "
                        "<th>HR</th>                                  "
                        "<th>%%</th></tr></thead><tbody>");
}

void changeExtension(char *filename, char *extension) {
    int i;
    int strLength;
    
    strLength = strlen(filename);
    
    // First, find out if the filename already includes an extension
    // To do this, find out if the pattern ".xxx" is at the end of the string
    if(filename[strLength-4] == '.') {
        for(i = 0; i < 3; i++) {
            filename[strLength-3+i] = extension[i];
        }
        filename[strLength-3+i] = '\0';
    }

    // If the pattern ".xxx" is not found at the end of the string, assume
    // there is no extension associated with filename and simply add the 
    // provided extension to the end
    
    else {
        filename[strLength] = '.';
        for(i = 0; i < 3; i++) {
            filename[strLength+1+i] = extension[i];
        }
        filename[strLength+1+i] = '\0';
    }
}

int rowCount(FILE *dataFile) {
    char ch;
    int i = 0;
    
    while((ch = fgetc(dataFile)) != EOF) {
        if(ch == '\n') i++;
    }
    
    return i;
}

char *grabInput(int row, int col, char *string_val, char *inputPath) {
    FILE *userInput; // file used to read inputs
    char ch;
    int i = 0;
    int flag = 1;

    userInput = fopen(inputPath,"r");
    if(userInput == NULL) {
        printf("\nError, input file not found!");
    }

    while(i < row) {
        ch = fgetc(userInput);
        if (ch == '\n') i++;
    }

    i = 0;

    while(i < col) {
        ch = fgetc(userInput);
        if (ch == ',' || ch == '\t') i++; // this allows either a CVS file or
    }                                     // tab delimited file to be read
    
    for(i = 0; flag == 1; i++) {
        ch = fgetc(userInput);
        if(ch == ',' || ch == '\t' || ch == '\n') {
            flag = 0;
            string_val[i] = 0;
        }
        else string_val[i] = ch;
    }
        
    fclose(userInput);
    return string_val;
}

void createPath(char *filePath, char *path, int age, char gender) {
    int i;
    
    if(age > 12) {
        if(age <= 19) age = 20;
        if(age >= 60) age = 60;
        age = age / 10;          // truncates age to the ten
        filePath[15] = age + 48; // converts to char
    } else {
        printf("\nUnable to create path to the correct wellness table,");
        printf(" age out of range...\n");
       }
    
    if(gender == 'M' || gender == 'm' || gender == 'F' || gender == 'f') {
        if(gender < 'a') gender = gender + 32;
        filePath[13] = gender;
    } else {
        printf("\nUnable to create path to the correct wellness table,");
        printf(" gender not entered as F or M...\n");
       }
    
    for(i = 0; i < 4; i++) filePath[i+8] = path[i];
}

float interpol(float x, char *tablePath, int order) {
    FILE *fTable;
    float x_tabVal1, y_tabVal1, x_tabVal2, y_tabVal2;
    float b, m;
    
    fTable = fopen(tablePath,"r");
    if (fTable == NULL) {
        printf("\nError, reference table not found!\n");
    }

    // find the four values needed to perform interpolation if table is inverse
    // related in other words, a lower x value produces a higher y value
    if (order == 0) {
      x_tabVal2 = -99.9;
      while(x > x_tabVal2) {
          y_tabVal1 = y_tabVal2;
          x_tabVal1 = x_tabVal2;
          y_tabVal2 = readTable(fTable);
          x_tabVal2 = readTable(fTable);
      }
    }

    // find the four values needed to perform interpolation if table is direct
    // related in other words, a lower x value produces a lower y value
    if (order == 1) {
      x_tabVal2 = 9999.9;
      while(x < x_tabVal2) {
          y_tabVal1 = y_tabVal2;
          x_tabVal1 = x_tabVal2;
          y_tabVal2 = readTable(fTable);
          x_tabVal2 = readTable(fTable);
      }
    }

    // calculate slope
    m = (y_tabVal2 - y_tabVal1) / (x_tabVal2 - x_tabVal1);

    // calculate y-intercept, y = mx + b, b = y - mx
    b = y_tabVal2 - m * x_tabVal2;
    
    fclose(fTable);
    
    return m * x + b;
}

float readTable(FILE *fTable) {
    char ch, string_val[30];
    int i;
    
    ch = fgetc(fTable);
    
    for(i = 0; ch != ',' && ch != '\n' && ch != '\t' && ch != EOF;  i++) {
        string_val[i] = ch;
        ch = fgetc(fTable);
    }
    string_val[i] = 0;
    return atof(string_val);
}
