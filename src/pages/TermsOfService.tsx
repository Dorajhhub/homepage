import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl p-4 pb-20 mx-auto">
      <div className="p-8 glass-card md:p-12 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 text-purple-600 bg-purple-100 rounded-xl dark:bg-purple-900/30 dark:text-purple-400">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Terms of Service
          </h1>
        </div>

        <div className="prose prose-lg text-gray-600 dark:prose-invert max-w-none dark:text-gray-300">
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h3>1. Agreement to Terms</h3>
          <p>
            By accessing our website, you agree to be bound by these Terms of
            Service and to comply with all applicable laws and regulations. If
            you do not agree with any of these terms, you are prohibited from
            using or accessing this site.
          </p>

          <h3>2. Use License</h3>
          <p>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on MinDevX's website for
            personal,
            <strong> non-commercial</strong> transitory viewing. This is the
            grant of a license, not a transfer of title. Under this license, you
            may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public
              display (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on
              MinDevX's website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials;
            </li>
            <li>
              transfer the materials to another person or “mirror” the materials
              on any other server.
            </li>
          </ul>

          <h3>2-1. Non-Commercial Use</h3>
          <p>
            Users may use the materials for{" "}
            <strong>non-commercial purposes</strong>, including personal study,
            research, and private reference, provided that such use does not
            violate any other part of these Terms.
          </p>

          <h3>2-2. Commercial Use Approval</h3>
          <p>
            If you wish to use any materials from MinDevX’s website for{" "}
            <strong>commercial purposes</strong>, you must first contact MinDevX
            to request and obtain explicit approval. MinDevX will review the
            request and determine whether to grant permission.
            <br />
            <br />
            <strong>
              Any commercial use of the materials without prior written approval
              is strictly prohibited.
            </strong>
          </p>

          <h3>3. Disclaimer</h3>
          <p>
            The materials on MinDevX's website are provided on an "as is" basis.
            MinDevX makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>

          <h3>4. Limitations</h3>
          <p>
            In no event shall MinDevX or its suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability
            to use the materials on MinDevX's website, even if MinDevX or an
            authorized representative has been notified orally or in writing of
            the possibility of such damage.
          </p>

          <h3>5. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of South Korea, and you irrevocably submit
            to the exclusive jurisdiction of the courts in that State or
            location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
