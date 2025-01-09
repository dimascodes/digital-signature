"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Key, CheckCircle } from "lucide-react";

const DigitalSignature = () => {
  const BASE_URL = process.env.BACKEND;
  const [activeTab, setActiveTab] = useState("create-keys");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [files, setFiles] = useState({
    publicKey: null,
    privateKey: null,
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
      const response = await fetch(`${BASE_URL}/api/create-keys`, {
        method: "POST",
      });
      if (response.ok) {
        setStatus({
          type: "success",
          message:
            "Kunci berhasil dibuat! Public dan private key telah diunduh.",
        });
      } else {
        throw new Error("Gagal membuat kunci.");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const signData = async () => {
    if (!files.dataFile || !files.privateKey) {
      setStatus({
        type: "error",
        message: "Mohon upload file data dan private key terlebih dahulu.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("dataFile", files.dataFile);
    formData.append("privateKey", files.privateKey);

    try {
      const response = await fetch(`${BASE_URL}/api/sign-data`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setStatus({
          type: "success",
          message: "Data berhasil ditandatangani dan hash file telah dibuat.",
        });
      } else {
        throw new Error("Gagal menandatangani data.");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const verifyData = async () => {
    if (!files.signatureFile || !files.publicKey || !files.hashFile) {
      setStatus({
        type: "error",
        message: "Mohon upload semua file yang diperlukan.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("signatureFile", files.signatureFile);
    formData.append("publicKey", files.publicKey);
    formData.append("hashFile", files.hashFile);

    try {
      const response = await fetch(`${BASE_URL}/api/verify-data`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setStatus({
          type: "success",
          message: "Verifikasi berhasil! Tanda tangan valid.",
        });
      } else {
        throw new Error("Gagal memverifikasi data.");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
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
              <TabsTrigger
                value="create-keys"
                className="flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Buat Kunci
              </TabsTrigger>
              <TabsTrigger
                value="sign-data"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Tanda Tangan
              </TabsTrigger>
              <TabsTrigger
                value="verify-data"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Verifikasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create-keys">
              <div className="space-y-4 p-4">
                <Button onClick={createKeys} className="w-full">
                  Generate Keys
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sign-data">
              <div className="space-y-4 p-4">
                <label>Upload Data File</label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "dataFile")}
                />
                <label>Upload Private Key</label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "privateKey")}
                />
                <Button onClick={signData} className="w-full">
                  Sign Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="verify-data">
              <div className="space-y-4 p-4">
                <label>Upload Signature File</label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "signatureFile")}
                />
                <label>Upload Public Key</label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "publicKey")}
                />
                <label>Upload Hash File</label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "hashFile")}
                />
                <Button onClick={verifyData} className="w-full">
                  Verify Data
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {status.message && (
            <Alert
              className={`mt-4 ${status.type === "error" ? "bg-red-50" : "bg-green-50"}`}
            >
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;

