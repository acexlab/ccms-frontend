/*
 * File: court-case-detail.component.ts
 * Description: Controller for the Court Officer case details view.
 * To Implement: Display document download anchors and formal bank response metrics.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/card'; // Wait, let's use @angular/material/card
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../services/case.service';
import { CaseDetail } from '../../models/case.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { MaskedTextComponent } from '../masked-text/masked-text.component';

// Note: Ensure correct material import: @angular/material/card
import { MatCardModule as MatMaterialCardModule } from '@angular/material/card';

@Component({
  selector: 'app-court-case-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatMaterialCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    StatusBadgeComponent,
    MaskedTextComponent
  ],
  templateUrl: './court-case-detail.component.html',
  styleUrls: ['./court-case-detail.component.scss']
})
export class CourtCaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);

  caseId!: number;
  caseDetail: CaseDetail | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.caseId = parseInt(idStr, 10);
        this.loadCaseDetails();
      }
    });
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.caseService.getCaseById(this.caseId).subscribe({
      next: (data) => {
        this.caseDetail = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.Message || 'Failed to load case details.';
        this.isLoading = false;
      }
    });
  }
}
