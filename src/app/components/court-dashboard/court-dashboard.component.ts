/*
 * File: court-dashboard.component.ts
 * Description: Controller for the Court Officer dashboard listing their raised cases.
 * To Implement: Display summary statistics counts cleanly.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../services/case.service';
import { CaseSummary } from '../../models/case.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './court-dashboard.component.html',
  styleUrls: ['./court-dashboard.component.scss']
})
export class CourtDashboardComponent implements OnInit {
  private caseService = inject(CaseService);

  cases: CaseSummary[] = [];
  displayedColumns: string[] = ['caseNumber', 'orderType', 'defendantName', 'status', 'createdAt', 'actions'];

  pendingCount = 0;
  validatedCount = 0;
  resolvedCount = 0;

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.caseService.getMyCases().subscribe({
      next: (data) => {
        this.cases = data;
        this.calculateStats();
      }
    });
  }

  calculateStats(): void {
    this.pendingCount = this.cases.filter(c => c.status === 'Pending').length;
    
    this.validatedCount = this.cases.filter(c => c.status === 'AccountValidated').length;
    
    this.resolvedCount = this.cases.filter(c => 
      c.status === 'FreezeApplied' || 
      c.status === 'BalanceProvided' || 
      c.status === 'AccountNotFound'
    ).length;
  }
}
