/*
 * File: case-inbox.component.ts
 * Description: Controller for the Bank Officer cases inbox.
 * To Implement: Keep tab lists synchronized with backend state values.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CaseInboxService } from '../../services/case-inbox.service';
import { CaseSummary } from '../../models/case.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-case-inbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './case-inbox.component.html',
  styleUrls: ['./case-inbox.component.scss']
})
export class CaseInboxComponent implements OnInit {
  private inboxService = inject(CaseInboxService);

  awaitingAction: CaseSummary[] = [];
  completed: CaseSummary[] = [];
  autoResolved: CaseSummary[] = [];
  pendingBatch: CaseSummary[] = [];

  displayedColumns: string[] = ['caseNumber', 'orderType', 'defendantName', 'status', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadInbox();
  }

  loadInbox(): void {
    this.inboxService.getCasesForBank().subscribe({
      next: (cases) => {
        this.awaitingAction = cases.filter(c => c.status === 'AccountValidated');
        
        this.completed = cases.filter(c => 
          c.status === 'FreezeApplied' || 
          c.status === 'BalanceProvided'
        );
        
        this.autoResolved = cases.filter(c => c.status === 'AccountNotFound');
        
        this.pendingBatch = cases.filter(c => c.status === 'Pending');
      }
    });
  }
}
