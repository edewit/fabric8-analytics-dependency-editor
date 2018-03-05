import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  StackLicenseAnalysisModel,
  LicenseStackAnalysisModel
} from '../model/data.model';
import {
  AlertBoxComponent
} from '../alert-box/alert-box.component';

@Component({
  selector: 'app-license',
  styleUrls: ['./license.component.less'],
  templateUrl: './license.component.html',
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() allLicenses: Array < any > = [];

  @ViewChild(AlertBoxComponent) private alertBoxComponent: AlertBoxComponent;

  public title = 'License';
  public icon = 'pficon pficon-on-running'; // fa-file-text-o
  public stackLicense: string;
  public stackStatus: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave = false;
  public licenseAll: Array < string > = [];
  public licenseIssue = true;
  public licenseDt: Array < any > = [];
  // public allLicenses: Array<any> = [];
  public licenseCount = {};
  public liData = [];
  // public licenseSynonym = {};
  public charts: any = {};

  constructor() {}

  ngOnChanges() {
    if (this.licenseData) {
      if (this.licenseData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.licenseData.f8a_stack_licenses[0];
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'conflict' || this.licenseData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.licenseData.status;
      }
    }
    // tslint:disable-next-line:one-line
    else if (this.lisData) {
      if (this.lisData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.lisData.stack_license;
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'conflict' || this.lisData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.lisData.status;
      }
    } else {
      this.stackLicense = null;
      this.stackStatus = null;
    }
    this.licenseAll = [];
    if (this.stackStatus === 'Successful') {
      for (let x = 0; x < this.allLicenses.length; x++) {
        if (typeof (this.allLicenses[0]) !== 'string') {
          this.allLicenses.forEach((i) => {
            i.licenses.forEach((j) => {
              this.licenseAll.push(this.filter(j));
            });
          });
        }
        // tslint:disable-next-line:one-line
        else {
          this.allLicenses.forEach((i) => {
            this.licenseAll.push(this.filter(i));
          });
        }
        this.licenseChange();
      }
    }
  }

  ngOnInit() {}

  public getShow(event) {
    this.toHave = event.toShow;
  }

  public licenseChange() {
    if (this.stackStatus === 'Successful') {
      if (this.licenseAll) {
        // this.licenseData = [];
        this.licenseCount = {};
        this.licenseAll.forEach(d => {
          this.licenseDt = this.licenseDt.concat(
            d
          );
        });
        this.licenseDt.forEach(item => {
          this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
        });
        this.liData = [];
        Object.keys(this.licenseCount).forEach(k => {
          this.liData.push([
            k,
            Math.round(this.licenseCount[k] * 100 / this.licenseDt.length)
          ]);
        });
      }
    }
    this.displayLicenses(this.liData);
  }

  public displayLicenses(liData): void {
    if (this.stackStatus === 'Successful') {
      this.charts['data'] = {
        columns: liData,
        type: 'donut'
      };
      this.charts['options'] = {
        donut: {
          title: ' Licenses', // + this.licenseData.length
          width: 10,
          label: {
            show: false
          }
        },
        size: {
          height: 200,
          width: 230
        }
      };
      this.charts['configs'] = {
        legend: {
          show: true,
        }
      };
    }
  }

  public filter(key: string) {
    const licenseSynonym = {
      'GNU Lesser General Public License (LGPL)': 'lgpl v?',
      'SNIA': 'unknown',
      'LGPL': 'lgplv2.1',
      'CPL': 'cpl 1.0',
      'Common Public License': 'cpl 1.0',
      'Simplified BSD License': 'bsd-simplified',
      'PSF license': 'unknown',
      'CC BY 3.0': 'cc-by-3.0',
      'Apache License 2.0': 'apache 2.0',
      'BSD License': 'unknown',
      'Eclipse Public License - v 1.0': 'epl 1.0',
      'GNU Lesser General Public License': 'lgplv2.1',
      'EPL': 'epl 1.0',
      'Apache v2': 'apache 2.0',
      'see LICENSE file.': 'unknown',
      'BSD 3-Clause': 'bsd-new',
      'BSD 2-Clause': 'bsd-simplified',
      'Simplified BSD': 'bsd-simplified',
      'LGPL/MIT': 'lgplv2.1',
      'LGPLv2+': 'lgplv2.1+',
      'The MIT License': 'mit',
      'BSD-3': 'bsd-new',
      'BSD-2': 'bsd-simplified',
      'WTFPL': 'unknown',
      'LICENSE': 'unknown',
      'Apache2': 'apache 2.0',
      'MITNFA': 'unknown',
      'GNU Affero General Public License v3': 'affero gplv3',
      'MIT http://www.opensource.org/licenses/mit-license.php': 'mit',
      'BSD 3-Clause License or Apache License': 'apache 2.0',
      'Apache Software License - Version 2.0': 'apache 2.0',
      'MPLv1.0': 'unknown',
      'SPL': 'unknown',
      'Eclipse Distribution License (New BSD License)': 'bsd-new',
      'The BSD 3-Clause License': 'bsd-new',
      'MIT/Expat': 'unknown',
      'Common Development and Distribution License': 'cddlv1.1+',
      'ASL 2.0': 'apache 2.0',
      'The PostgreSQL License': 'postgresql',
      'GPLv2+CE': 'unknown',
      'Apache-2': 'apache 2.0',
      'GPL': 'gplv2',
      'new BSD': 'bsd-new',
      'GNU Lesser General Public License, Version 2.1': 'lgplv2.1',
      'Revised BSD': 'bsd-new',
      'GNU General Lesser Public License (LGPL) version 2.1': 'lgplv2.1',
      'new BSD License': 'bsd-new',
      'New Relic License': 'unknown',
      'New BSD': 'bsd-new',
      'DMIT': 'unknown',
      'dvipdfm': 'unknown',
      'GPLv2 with exceptions': 'gplv2',
      'BSD license (see license.txt for details)': 'unknown',
      'dual license GPLv2+ and Apache v2': 'gplv3',
      'Apache Version 2.0': 'apache 2.0',
      'BSD - See LICENCE file for details': 'unknown',
      'Expat license': 'unknown',
      'CDDL+GPL': 'gplv2',
      'LDPL': 'unknown',
      'http://opensource.org/licenses/MIT': 'mit',
      'LBNL BSD': 'unknown',
      'LGPL 3': 'lgplv3',
      'Apache License': 'apache 2.0',
      '3-Clause BSD License': 'bsd-new',
      'STMPL': 'unknown',
      'GPL with exceptions or ZPL': 'gplv2',
      '3-clause BSD License': 'bsd-new',
      'CDDL/GPLv2+CE': 'unknown',
      'mplus': 'unknown',
      'EPICS': 'unknown',
      'LGPLv2+ with exceptions': 'lgplv2.1',
      'Nmap': 'unknown',
      'GNU GPLv3': 'gplv3',
      '2-clause BSD License': 'bsd-simplified',
      'BSD style': 'unknown',
      'PHP': 'unknown',
      'Jabber': 'unknown',
      'LGPLv2': 'lgplv2.1',
      'ASL 1.1': 'apache 1.1',
      'Public Domain': 'public domain',
      'public domain': 'public domain',
      'Forbidden Phrase': 'unknown',
      'GNU/LGPLv3': 'lgplv3',
      'OpenLDAP BSD': 'unknown',
      'copyright.txt': 'unknown',
      'ASL 2': 'apache 2.0',
      'http://www.apache.org/licenses/LICENSE-2.0': 'apache 2.0',
      'LGPLv3+': 'lgplv3',
      'ec': 'unknown',
      'CC0': 'cc0v1.0',
      'LGPL-3': 'lgplv3',
      'CC0 1.0 Universal': 'cc0v1.0',
      'NetCDF': 'unknown',
      'FreeBSD License': 'unknown',
      'PSF or ZPL': 'unknown',
      'Apache': 'apache 2.0',
      'MIT License': 'mit',
      'ReportLab Inc.': 'unknown',
      'This software released into the public domain. Anyone is free to copy': 'public domain',
      'Apache License v2': 'apache 2.0',
      'LGPL+BSD': 'lgplv2.1',
      'MIT Licenses': 'mit',
      'Apache Software License, Version 1.1': 'apache 1.1',
      'HSQLDB License, a BSD open source license': 'unknown',
      'CDDL': 'cddlv1.1+',
      'W3C': 'w3c',
      'Cube': 'unknown',
      'GNU GPL 3': 'gplv3',
      'APL2': 'apache 2.0',
      'LOSLA': 'unknown',
      'ASL 1.0': 'apache 1.1',
      'see LICENSE.txt': 'unknown',
      'publish': 'unknown',
      'Baekmuk': 'unknown',
      'MIT or BSD': 'bsd-simplified',
      'Bouncy Castle License': 'bouncycastle',
      'BOUNCYCASTLE': 'bouncycastle',
      'Apache License v2.0': 'apache 2.0',
      'The Apache Software License, Version 1.1': 'apache 1.1',
      'BSD 3-clause': 'bsd-new',
      'Netscape': 'unknown',
      'BitTorrent Open Source License': 'unknown',
      'AFL': 'unknown',
      'GNU GPL v2': 'gplv2',
      'MPLv2.0': 'mpl 2.0',
      'PSFL': 'unknown',
      'ASF 2.0': 'apache 2.0',
      'Rsfs': 'unknown',
      'modify': 'unknown',
      'BSD-derived (http://www.repoze.org/LICENSE.txt)': 'bsd-new',
      'The Apache Software License': 'apache 2.0',
      'Eclipse Public License': 'epl 1.0',
      'lgpl': 'lgplv2.1',
      'gpl-3.0.txt': 'gplv3',
      'CPAL': 'cpal 1.0',
      'Common Public Attribution License': 'cpal 1.0',
      'Apachev2 or later or GPLv2': 'unknown',
      'MPL 1.1': 'mpl 1.1',
      'Punknova': 'unknown',
      '2-clause BSD': 'bsd-simplified',
      'BSD licence': 'bsd-simplified',
      'GNU GPL v3.0': 'gplv3',
      'MIT license': 'mit',
      'Copyright Yelp 2013': 'unknown',
      'New BSD license': 'bsd-new',
      'License :: OSI Approved :: MIT License': 'mit',
      'GNU LGPL 3.0': 'lgplv3',
      'ALv2': 'unknown',
      'Plexus': 'unknown',
      'BSD 2-Clause License': 'bsd-simplified',
      'PSF': 'unknown',
      'GNU General Public License 3': 'gplv3',
      'UNLICENSE': 'unknown',
      'wxWidgets Library License (LGPL derivative)': 'unknown',
      'LGPLv3': 'lgplv3',
      'Apache 2': 'apache 2.0',
      'Unicode': 'unknown',
      'BSD-like (http://repoze.org/license.html)': 'unknown',
      'MIT': 'mit',
      'Amazon Software License': 'unknown',
      'MPL v2': 'mpl 2.0',
      'REX': 'unknown',
      'Apache License (2.0)': 'apache 2.0',
      'ImageMagick': 'unknown',
      'Eclipse Public License 1.0': 'epl 1.0',
      'W3C SOFTWARE NOTICE AND LICENSE': 'w3c',
      'Copyright Yelp 2014': 'unknown',
      'UNKNOWN': 'unknown',
      'Saxpath': 'unknown',
      'libtiff': 'unknown',
      'GPL 2': 'gplv2',
      'GPL 3': 'gplv3',
      'GPL 3 (see COPYING.txt)': 'gplv3',
      'GPL v2': 'gplv2',
      'BSD-like': 'unknown',
      'commercial or non-commercial': 'unknown',
      'ISC': 'unknown',
      '(new) BSD': 'bsd-new',
      'Boost Software License': 'unknown',
      'either version 3 of the License': 'unknown',
      'Choice of GPL or Python license': 'unknown',
      'Public domain': 'public domain',
      'Google App Engine Terms of Service': 'unknown',
      'GNU Affero General Public License as published by the Free Software Foundation': 'affero gpl v?',
      'CDDL 1.1': 'cddlv1.1+',
      'LGPL 3.0': 'lgplv3',
      'BSD 3-Clause License': 'bsd-new',
      'GNU GPLv2 or any later version': 'gplv2+',
      'Eclipse Public License, Version 1.0': 'epl 1.0',
      'FSFUL': 'unknown',
      'GNU AGPLv3+ or BSD': 'unknown',
      'for any purpose': 'public domain',
      'Mozilla Public License, Version 2.0': 'mpl 2.0',
      'Common Development and Distribution License (CDDL) v1.0': 'cddlv1.1+',
      'Common Development and Distribution License (CDDL) v2.0': 'cddlv1.1+',
      'DoubleStroke': 'unknown',
      'Beerware': 'unknown',
      'ECL 2.0': 'unknown',
      'BSD': 'bsd-simplified',
      'Apache 2.0': 'apache 2.0',
      'xpp': 'unknown',
      'CC0 (copyright waived)': 'cc0v1.0',
      'GPLv2': 'gplv2',
      '3-clause BSD <http://www.opensource.org/licenses/bsd-license.php>': 'bsd-new',
      'Modified BSD License': 'bsd-new',
      'Python style': 'unknown',
      'Common Public License Version 1.0': 'cpl 1.0',
      'MPL 2.0 or EPL 1.0': 'mpl 2.0',
      'GPLv3': 'gplv3',
      'PayPal SDK License': 'unknown',
      'GNU Library or Lesser General Public License (LGPL)': 'lgplv2.1',
      'License :: OSI Approved :: Apache Software License': 'unknown',
      'GPL license with a special exception which allows to use PyInstaller to build and distribute non-free programs (including commercial ones)': 'unknown',
      'Entessa': 'unknown',
      'GNU LGPL': 'lgplv2.1',
      'Python Software Foundation License': 'unknown',
      'BSD (3 clause)': 'bsd-new',
      'BSD (2 clause)': 'bsd-simplified',
      'LGPL 2.1+': 'lgplv2.1+',
      'License :: OSI Approved :: MIT License (http://opensource.org/licenses/MIT)': 'mit',
      'Apache modified': 'apache 2.0',
      'Eclipse Public License v1.0': 'epl 1.0',
      'Eclipse Distribution License v1.0': 'edl',
      'EDL': 'edl',
      'JasPer': 'unknown',
      'GNU GPL version 3': 'gplv3',
      'GNU General Public License v2 (GPLv2)': 'gplv2',
      'BSD - See ndg/httpsclient/LICENCE file for details': 'unknown',
      'Dual license consisting of the CDDL v1.1 and GPL v2': 'gplv2',
      'BSD or Apache License': 'apache 2.0',
      'CDL': 'unknown',
      'CDDL + GPLv2 with classpath exception': 'gplv2',
      'zlib': 'unknown',
      'GNU General Public License, Version 2 with the Classpath Exception': 'gplv2',
      'BSD-3-Clause': 'bsd-new',
      'BSD-style license': 'unknown',
      'compile': 'unknown',
      'Modified BSD': 'bsd-new',
      'Tumbolia Public License': 'unknown',
      'Standard PIL License': 'unknown',
      'Expat License': 'unknown',
      'GNU Library or Lesser General Public License': 'lgplv2.1',
      'Apache 2.0 License': 'apache 2.0',
      'Apache License, version 2.0': 'apache 2.0',
      'ASL': 'apache 2.0',
      'Mozilla Public License 2.0 (MPL 2.0)': 'mpl 2.0',
      'and by any means.': 'unknown',
      'GNU GPL': 'gplv2',
      'LGPL-2.1': 'lgplv2.1',
      'Newsletr': 'unknown',
      'BSD New': 'bsd-new',
      'BSD Simplified': 'bsd-simplified',
      'MIT or Apache License': 'apache 2.0',
      'AAL': 'unknown',
      'BSD with attribution': 'unknown',
      'BSD with advertising': 'unknown',
      'New BSD License': 'bsd-new',
      'MIT/X': 'mit',
      'The Apache Software License, Version 2.0': 'apache 2.0',
      'Public Domain, per Creative Commons CC0': 'public domain',
      'Apache Software License': 'apache 2.0',
      'The MIT License: http://www.opensource.org/licenses/mit-license.php': 'mit',
      'Apache Software Licenses': 'apache 2.0',
      'OSI Approved': 'unknown',
      'LPGL': 'lgplv2.1',
      'Apache License, Version 2.0': 'apache 2.0',
      'Apache-2.0': 'apache 2.0',
      'Creative Commons Attribution-Noncommercial-Share Alike license': 'unknown',
      'sell': 'unknown',
      'LGPL 2.1': 'lgplv2.1',
      'License :: OSI Approved :: BSD License': 'unknown',
      'GNU General Public License, Version 3': 'gplv3',
      'gnuplot': 'unknown',
      'Python': 'unknown',
      'GPLv1': 'unknown',
      'CDDL+GPL License': 'gplv2',
      'The JSON License': 'json',
      'JSON': 'json',
      'Eclipse Public License - Version 1.0': 'epl 1.0',
      'OpenSSL': 'unknown',
      'MIT Licences': 'mit',
      'BSD 2.0': 'bsd-new',
      'MPLv1.1': 'mpl 1.1',
      'UCD': 'unknown',
      'GNU Affero General Public License, Version 3': 'affero gplv3',
      'The Apache License, Version 2.0': 'apache 2.0',
      'ECL 1.0': 'unknown',
      'LGPL with exceptions or ZPL': 'unknown',
      '2-Clause BSD': 'bsd-simplified',
      'BSD-2-Clause': 'bsd-simplified',
      'Jedis License': 'unknown',
      'GPL2': 'gplv2',
      'ZPL 2.1': 'unknown',
      'Atomikos Multiple Licensing Scheme': 'unknown',
      'Apache v2.0': 'apache 2.0',
      'GPL2 w/ CPE': 'unknown',
      'Apache License Version 2.0': 'apache 2.0',
      'The GNU General Public License, Version 2': 'gplv2',
      'NetBeans CDDL/GPL': 'unknown',
      'ISC license': 'unknown',
      'Webmin': 'unknown',
      'LGPL 2.1 or later': 'lgplv2.1+',
      'FSFULLR': 'unknown',
      'The MIT License (MIT)': 'mit',
      'Free Art': 'unknown',
      'The GNU Lesser General Public License, version 3': 'lgplv3',
      'All Rights Reserved': 'unknown',
      'GPL-3': 'gplv3',
      'APAFML': 'unknown',
      'PSF License': 'unknown',
      'PostgreSQL': 'postgresql',
      'POSTGRESQL': 'postgresql',
      'Zed': 'unknown',
      'Sequence': 'unknown',
      'DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE': 'public domain',
      'VSL': 'unknown',
      'BSD (3-clause)': 'bsd-new',
      'Two-clause BSD license': 'bsd-simplified',
      '3-clause BSD': 'bsd-new',
      'Apache Software License 2.0': 'apache 2.0',
      'Apache Software License 1.1': 'apache 1.1',
      'see LICENSE file': 'unknown',
      'COMMON DEVELOPMENT AND DISTRIBUTION LICENSE (CDDL) Version 1.0': 'cddlv1.1+',
      'COMMON DEVELOPMENT AND DISTRIBUTION LICENSE (CDDL) Version 2.0': 'cddlv1.1+',
      'Unlicense': 'unknown',
      'all rights reserved': 'unknown',
      'MPL 2.0, and EPL 1.0': 'mpl 2.0',
      'ARL': 'unknown',
      'NCSA': 'unknown',
      'Open Software License': 'unknown',
      'PD': 'public domain',
      'APACHE': 'apache 2.0',
      'LGPL V2.1': 'lgplv2.1',
      'LGPL V2.1+': 'lgplv2.1+',
      'LGPL V3+': 'lgplv3+',
      'GPL V2': 'gplv2',
      'GPL V2+': 'gplv2+',
      'GPL V3+': 'gplv3+',
      'AGPLV3': 'affero gplv3+',
      'EPL 1.0': 'epl 1.0',
      'CDDL 2': 'cddlv1.1+',
      'CDDL 1.0': 'cddlv1.1+',
      'MPL 2.0': 'mpl 2.0',
    };
    return licenseSynonym[key];
  }
}