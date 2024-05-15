import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { environment } from '../environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';

//primeng components
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

import { BudgetsPageComponent } from './pages/budgets-page/budgets-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { DashboardSummaryCardsComponent } from './components/dashboard-summary-cards/dashboard-summary-cards.component';
import { TransactionsPageComponent } from './pages/transactions-page/transactions-page.component';
import { DashboardExpensesBrokenDownComponent } from './components/dashboard-expenses-broken-down/dashboard-expenses-broken-down.component';
import { CustomPanelComponent } from './components/custom-panel/custom-panel.component';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';
import { DashboardMonthlyChartComponent } from './components/dashboard-monthly-chart/dashboard-monthly-chart.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';

import { IncomeCardComponent } from './components/income-card/income-card.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { AddIncomeDialogComponent } from './components/add-income-dialog/add-income-dialog.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpeedDialModule } from 'primeng/speeddial';
import { PaginatorModule } from 'primeng/paginator';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';

import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import { DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { IncomeReportComponent } from './components/income-report/income-report.component';
import { SavingGoalsPageComponent } from './saving-goals-page/saving-goals-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    TransactionsPageComponent,
    BudgetsPageComponent,
    ReportsPageComponent,
    IncomeCardComponent,
    IncomesPageComponent,
    DashboardSummaryCardsComponent,
    DashboardExpensesBrokenDownComponent,
    CustomPanelComponent,
    PageWrapperComponent,
    DashboardMonthlyChartComponent,
    LoginPageComponent,
    SignupPageComponent,
    AddIncomeDialogComponent,
    IncomeReportComponent,
    SavingGoalsPageComponent,
  ],
  imports: [
    AccordionModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    PaginatorModule,
    ReactiveFormsModule,
    //primeng
    MenubarModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    CheckboxModule,
    RatingModule,
    TagModule,
    InputTextModule,
    ChipModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    CardModule,
    DividerModule,
    DataViewModule,
    TableModule,
    PanelModule,
    CardModule,
    FieldsetModule,
    SplitterModule,
    SpeedDialModule,
    SliderModule,
    ChartModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    FloatLabelModule,
    CalendarModule,
    InputTextareaModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    PanelModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule {}
