"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DigitalSignature = () => {
  const [activeTab, setActiveTab] = useState("create-keys");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sessionKeys, setSessionKeys] = useState({
    privateKey: null,
    publicKey: null,
  });
  const [files, setFiles] = useState({
    dataFile: null,
    hashFile: null,
    signatureFile: null,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const createKeys = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/create-keys`,
        { method: "POST" },
      );
      const data = await response.json();
      setSessionKeys({
        privateKey: data.private_key,
        publicKey: data.public_key,
      });
      setStatus({
        type: "success",
        message: "Keys generated successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to generate keys.",
      });
    }
  };

  const resetKeys = () => {
    setSessionKeys({ privateKey: null, publicKey: null });
    setStatus({
      type: "success",
      message: "Keys reset successfully!",
    });
  };

  const signData = async () => {
    if (!files.dataFile || (!files.privateKey && !sessionKeys.privateKey)) {
      setStatus({
        type: "error",
        message: "Upload data file and private key first.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("dataFile", files.dataFile);
    formData.append(
      "privateKey",
      files.privateKey ||
        new Blob([sessionKeys.privateKey], { type: "text/plain" }),
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/sign`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Data signed successfully!",
        });
      } else {
        throw new Error("Failed to sign data.");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Digital Signature System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="create-keys">Generate Keys</TabsTrigger>
              <TabsTrigger value="sign-data">Sign Data</TabsTrigger>
              <TabsTrigger value="verify-data">Verify Data</TabsTrigger>
            </TabsList>

            <TabsContent value="create-keys">
              <div className="space-y-4 p-4">
                <Button onClick={createKeys}>Generate Keys</Button>
                {sessionKeys.privateKey && (
                  <>
                    <div>
                      <strong>Private Key:</strong>
                      <textarea
                        className="w-full"
                        rows="4"
                        value={sessionKeys.privateKey}
                        readOnly
                      />
                    </div>
                    <div>
                      <strong>Public Key:</strong>
                      <textarea
                        className="w-full"
                        rows="4"
                        value={sessionKeys.publicKey}
                        readOnly
                      />
                    </div>
                    <Button onClick={resetKeys}>Reset Keys</Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sign-data">
              <div className="space-y-4 p-4">
                <div>
                  <label>Upload Data File</label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "dataFile")}
                  />
                </div>
                <div>
                  <label>Upload Private Key</label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "privateKey")}
                  />
                </div>
                <Button onClick={signData}>Sign Data</Button>
              </div>
            </TabsContent>
          </Tabs>
          {status.message && <Alert>{status.message}</Alert>}
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;
