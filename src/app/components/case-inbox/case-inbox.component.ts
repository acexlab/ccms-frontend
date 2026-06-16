import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CaseService } from '../../services/case.service';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-case-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, MatTableModule, MatPaginatorModule, StatusBadgeComponent],
  templateUrl: './case-inbox.component.html',
  styleUrls: ['./case-inbox.component.scss']
})
export class CaseInboxComponent implements OnInit {
  inboxData: any = {
    awaitingAction: [],
    pendingBatch: [],
    completed: [],
    autoResolved: []
  };

  displayedColumns: string[] = ['caseNumber', 'defendantName', 'orderType', 'status', 'validationDate', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentTabIndex = 0;

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit(): void {
    if (history.state && history.state.activeTab !== undefined) {
      this.currentTabIndex = history.state.activeTab;
    }
    this.loadInbox();
  }

  loadInbox(): void {
    this.caseService.getInboxCases().subscribe({
      next: (data) => {
        this.inboxData = data;
        this.updateTableData();
      },
      error: (err) => console.error('Error loading inbox', err)
    });
  }

  onTabChange(event: any): void {
    this.currentTabIndex = event.index;
    this.updateTableData();
  }

  updateTableData(): void {
    let dataToDisplay: any[] = [];
    switch (this.currentTabIndex) {
      case 0:
        dataToDisplay = this.inboxData.awaitingAction || [];
        break;
      case 1:
        dataToDisplay = this.inboxData.pendingBatch || [];
        break;
      case 2:
        dataToDisplay = this.inboxData.completed || [];
        break;
      case 3:
        dataToDisplay = this.inboxData.autoResolved || [];
        break;
    }
    this.dataSource = new MatTableDataSource<any>(dataToDisplay);
    this.dataSource.paginator = this.paginator;
  }

  getOrderTypeDisplay(orderType: string): string {
    if (orderType === 'FreezeAccount') return 'Freeze Order';
    if (orderType === 'BalanceEnquiry') return 'Balance Enquiry';
    return orderType;
  }

  reviewCase(caseNumber: string): void {
    this.router.navigate(['/bank/cases', caseNumber]);
  }
}
